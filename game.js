let currentPlayer = 1;
let totalPlayers = 2;
let round = 1;
let timerInterval;
let timeLeft = 180;
let savedNotes = [];

function startGame(players) {
    totalPlayers = players;
    document.getElementById("welcome-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
    updateTurnDisplay();
}

// Create working deck copies
let activeDecks = {};

function initializeDecks() {
    activeDecks = {
        scenario: [...cards.scenario],
        principle: [...cards.principle],
        reflection: [...cards.reflection],
        wildcard: [...cards.wildcard]
    };
}

initializeDecks();

function drawCard(deckName) {
    const deck = activeDecks[deckName];

    if (deck.length === 0) {
        alert("No more cards in this deck!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0]; // removes card from deck

    updateDeckCount(deckName);

    document.getElementById("card-type").innerText = deckName.toUpperCase();
    document.getElementById("card-title").innerText = card.title;
    document.getElementById("card-difficulty").innerText = card.difficulty;
    document.getElementById("card-body").innerText = card.content;

    const promptsContainer = document.getElementById("discussion-prompts");
    promptsContainer.innerHTML = "";

    card.prompts.forEach(prompt => {
        const p = document.createElement("p");
        p.innerText = "• " + prompt;
        promptsContainer.appendChild(p);
    });

    document.getElementById("card-display").classList.remove("hidden");
}
function updateDeckCount(deckName) {
    document.getElementById(`${deckName}-count`).innerText =
        activeDecks[deckName].length + " cards remaining";
}


function nextTurn() {
    currentPlayer++;
    if (currentPlayer > totalPlayers) {
        currentPlayer = 1;
        round++;
    }
    document.getElementById("card-display").classList.add("hidden");
    updateTurnDisplay();
}

function updateTurnDisplay() {
    document.getElementById("round-counter").innerText = "Round " + round;
    document.getElementById("player-turn").innerText = "Player " + currentPlayer + "'s Turn";
}

function startTimer() {
    timeLeft = 180;
    const timerDisplay = document.getElementById("timer-display");
    const timerText = document.getElementById("timer-text");

    timerDisplay.classList.remove("hidden");

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerText.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function saveNote() {
    const note = document.getElementById("card-notes").value;
    if (note.trim() !== "") {
        savedNotes.push(note);
        document.getElementById("card-notes").value = "";
        alert("Note saved!");
    }
}

function endGame() {
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("summary-screen").classList.add("active");

    const notesContainer = document.getElementById("saved-notes");
    savedNotes.forEach(note => {
        const p = document.createElement("p");
        p.innerText = "• " + note;
        notesContainer.appendChild(p);
    });
}

function resetGame() {
    location.reload();
}

function downloadNotes() {
    const blob = new Blob([savedNotes.join("\n\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "peer-educator-notes.txt";
    link.click();
}
