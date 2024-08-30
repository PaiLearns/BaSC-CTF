// Simulated backend data
const challenges = [
    { id: 1, name: "Challenge 1", description: "Solve this first challenge.", file_url: "challenge1.zip", flag: "flag1", points: 10 },
    { id: 2, name: "Challenge 2", description: "This is the second challenge.", file_url: "challenge2.zip", flag: "flag2", points: 20 },
    { id: 3, name: "Challenge 3", description: "The third challenge is here.", file_url: "challenge3.zip", flag: "flag3", points: 30 }
];

let userPoints = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username')) {
        displayChallenges();
        updatePoints();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('challenges-container').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'inline-block';
    }
});

function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('challenges-container').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'inline-block';
        displayChallenges();
    }
}

function logout() {
    localStorage.removeItem('username');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('challenges-container').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function displayChallenges() {
    const container = document.getElementById('challenges-container');
    container.innerHTML = '';
    challenges.forEach(challenge => {
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge';
        challengeDiv.innerHTML = `
            <h2>${challenge.name}</h2>
            <p>${challenge.description}</p>
            <a href="${challenge.file_url}" download>Download Challenge File</a>
            <form onsubmit="return submitFlag(event, ${challenge.id})">
                <input type="text" id="flag-${challenge.id}" placeholder="Enter your flag here" required>
                <button type="submit">Submit Flag</button>
            </form>
        `;
        container.appendChild(challengeDiv);
    });
}

function submitFlag(event, challengeId) {
    event.preventDefault();
    const flagInput = document.getElementById(`flag-${challengeId}`);
    const flag = flagInput.value.trim();
    const challenge = challenges.find(c => c.id === challengeId);

    if (challenge && flag === challenge.flag) {
        userPoints += challenge.points;
        localStorage.setItem('points', userPoints);
        updatePoints();
        alert('CONGRATULATIONS!!!!');
    } else {
        alert('Incorrect flag, try again.');
    }

    flagInput.value = '';
}

function updatePoints() {
    const points = localStorage.getItem('points') || 0;
    document.getElementById('points').innerText = `Points: ${points}`;
}

document.getElementById('logout-btn').addEventListener('click', logout);
