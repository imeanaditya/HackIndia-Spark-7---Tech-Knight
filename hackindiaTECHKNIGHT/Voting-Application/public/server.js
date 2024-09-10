const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/votingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const CandidateSchema = new mongoose.Schema({
    name: String,
    voteCount: Number,
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

const web3 = new Web3('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Replace with your Infura project ID
const contractAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B'; // Replace with your contract address
const abi = [ /* Your contract ABI here */ ];
const contract = new web3.eth.Contract(abi, contractAddress);

app.use(cors());
app.use(bodyParser.json());

app.post('/addCandidate', async (req, res) => {
    try {
        const { name } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addCandidate(name).send({ from: accounts[0] });

        const newCandidate = new Candidate({ name, voteCount: 0 });
        await newCandidate.save();

        res.status(200).send('Candidate added successfully');
    } catch (error) {
        res.status(500).send('Error adding candidate: ' + error.message);
    }
});

app.post('/vote', async (req, res) => {
    try {
        const { candidateId } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.vote(candidateId).send({ from: accounts[0] });

        await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

        res.status(200).send('Vote cast successfully');
    } catch (error) {
        res.status(500).send('Error casting vote: ' + error.message);
    }
});

app.get('/candidate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await contract.methods.getCandidate(id).call();
        res.status(200).json({ name: candidate.name, voteCount: candidate.voteCount });
    } catch (error) {
        res.status(500).send('Error retrieving candidate: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
