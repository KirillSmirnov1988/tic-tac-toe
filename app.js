// Global Constants and Variables
// Constants defining the elements and states of the game
const CELLS = document.querySelectorAll(".cell");
const STATUS_HEADER = document.querySelector("h1");
const FINAL_BLOCK = document.querySelector(".final-block");
const MODAL = document.getElementById("rulesModal");
const CLOSE_BUTTON = document.querySelector(".close-button");
const START_GAME_BUTTON = document.getElementById("new-game");

// All possible winning combinations
const WINNING_COMBOS = [
  ["0", "1", "2"], // Top row
  ["3", "4", "5"], // Middle row
  ["6", "7", "8"], // Bottom row
  ["0", "3", "6"], // Left column
  ["1", "4", "7"], // Middle column
  ["2", "5", "8"], // Right column
  ["0", "4", "8"], // Diagonal top-left to bottom-right
  ["2", "4", "6"], // Diagonal top-right to bottom-left
];

// Constants for players
const PLAYER_X = "X";
const PLAYER_O = "O";

// Variables to manage the game state
let winningCombo = []; // Stores the current winning combination
let whoIsStart = PLAYER_X; // Tracks who starts the next game
let currentPlayer; // Tracks the current player
let stepCounter = 0; // Counts the number of moves in the current game

let timerInterval; // To store the timer interval

// Initialization
window.onload = () => {
  console.log("App started.");
  MODAL.style.display = "flex";
};

// Close the modal when the close button is clicked
CLOSE_BUTTON.addEventListener("click", () => {
  MODAL.style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === MODAL) {
    MODAL.style.display = "none";
  }
});

// Event Handlers
// Handles a player's click on a cell
function handleCellClick(event) {
  const cell = event.target;

  // Add the player's marker (image) to the clicked cell
  const img = document.createElement("img");
  img.src = currentPlayer === PLAYER_X ? "images/x.png" : "images/o.png";
  img.alt = currentPlayer;
  cell.appendChild(img);

  // Prevent further clicks on the same cell
  cell.removeEventListener("click", handleCellClick);
  cell.classList.add(currentPlayer);

  // Check if the current player has won
  if (checkIfCurrentPlayerWon(currentPlayer)) {
    winnerAction(currentPlayer);
    return;
  }

  // Check for a draw (all cells filled without a winner)
  if (stepCounter === 8) {
    drawAction();
    return;
  }

  // Switch to the next player
  currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  STATUS_HEADER.textContent = `It's "${currentPlayer}" turn`;
  stepCounter++;

  startTimer(); // Start the timer for the next turn
}

// Add click event listeners to Start button
START_GAME_BUTTON.addEventListener("click", startNewGame);

// Core Game Logic
// Checks if the current player has achieved a winning combination
function checkIfCurrentPlayerWon(currentPlayer) {
  const currentPlayerCells = [];
  CELLS.forEach((cell) => {
    if (cell.classList.contains(currentPlayer)) {
      currentPlayerCells.push(cell.id);
    }
  });

  return checkIfIncludesWinComb(currentPlayerCells);
}

// Determines if any winning combination is satisfied
function checkIfIncludesWinComb(currentPlayerCells) {
  for (const combination of WINNING_COMBOS) {
    if (combination.every((element) => currentPlayerCells.includes(element))) {
      winningCombo = combination; // Store the winning combination
      return true;
    }
  }
  return false;
}

// Result Management
// Executes actions when a player wins
function winnerAction(winner, byProfit) {
  stopTimer(); // Stop the timer when the game ends

  // Determine the winning message based on how the win occurred
  if (byProfit) {
    STATUS_HEADER.textContent = `PLAYER "${winner}" WINS BY FORFEIT!`;
  } else {
    STATUS_HEADER.textContent = `PLYAER "${winner}" WON!!!`;
  }

  // Increment the winner's score
  const scoreElement = document.getElementById(`score${winner}`);
  scoreElement.textContent = parseInt(scoreElement.textContent) + 1;

  // Highlight the winning cells
  CELLS.forEach((cell) => {
    if (winningCombo.includes(cell.id)) {
      cell.classList.add("winner-cell");
    }
  });
  // Display the "START NEW GAME" button
  displayStartNewGame();
}

// Executes actions when the game ends in a draw
function drawAction() {
  // Stop the timer when the game ends
  stopTimer();
  // Update the header
  STATUS_HEADER.textContent = `IT'S DRAW`;
  // Display the "START NEW GAME" button
  displayStartNewGame();
}

// Utility Functions
// Displays the "START NEW GAME" button
function displayStartNewGame() {
  const h2 = document.createElement("h2");
  h2.addEventListener("click", startNewGame);
  h2.textContent = `START NEW GAME`;

  FINAL_BLOCK.appendChild(h2);

  // Disable clicks on all cells
  CELLS.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}

// Resets the game for a new round
function startNewGame() {
  // Remove the "START NEW GAME" button
  const element = document.querySelector(".final-block h2");
  if (element) {
    element.remove();
  }

  // Reset the current player and update the status
  currentPlayer = whoIsStart;
  whoIsStart = whoIsStart === PLAYER_X ? PLAYER_O : PLAYER_X;
  document.querySelector("h1").textContent = `It's "${currentPlayer}" turn`;
  STATUS_HEADER.textContent = `It's "${currentPlayer}" turn`;

  // Reset the board and re-enable cell clicks
  CELLS.forEach((cell) => {
    cell.classList.remove(PLAYER_X, PLAYER_O, "winner-cell");
    const img = cell.querySelector("img");
    if (img) {
      img.remove();
    }
    cell.addEventListener("click", handleCellClick);
  });

  // Reset the move counter
  stepCounter = 0;
  winningCombo = [];

  // Reset the timer
  startTimer();
}

function startTimer() {
  let timeLeft = 30; // Reset to 30 seconds
  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;

  // Clear any previous interval
  clearInterval(timerInterval);

  // Start a new countdown
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);

      // Declare the other player as the winner
      const winner = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

      // Stop the game and display the winner
      winnerAction(winner, true);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
