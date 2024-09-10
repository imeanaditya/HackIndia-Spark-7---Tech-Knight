<script>
    async function addCandidate() {
        const name = document.getElementById('candidateName').value;
        try {
            await fetch('http://localhost:3000/addCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            alert('Candidate added successfully');
        } catch (error) {
            alert('Error adding candidate: ' + error.message);
        }
    }

    async function vote() {
        const id = document.getElementById('candidateId').value;
        try {
            await fetch('http://localhost:3000/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateId: id }),
            });
            alert('Vote cast successfully');
        } catch (error) {
            alert('Error casting vote: ' + error.message);
        }
    }

    async function viewCandidate() {
        const id = document.getElementById('viewCandidateId').value;
        try {
            const response = await fetch(`http://localhost:3000/candidate/${id}`);
            const candidate = await response.json();
            document.getElementById('candidateInfo').innerText = `Name: ${candidate.name}, Votes: ${candidate.voteCount}`;
        } catch (error) {
            document.getElementById('candidateInfo').innerText = 'Error retrieving candidate: ' + error.message;
        }
    
</script>
