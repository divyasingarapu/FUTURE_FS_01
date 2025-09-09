const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeBtn = document.getElementById("modeBtn");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let singlePlayer = true; // default mode

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  if (boardState[index] !== "" || !gameActive) return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    if (singlePlayer && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  let emptyIndices = boardState
    .map((val, i) => (val === "" ? i : null))
    .filter(v => v !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  boardState[randomIndex] = "O";
  cells[randomIndex].textContent = "O";

  checkWinner();

  if (gameActive) {
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  for (let combo of winningConditions) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      statusText.textContent = `Player ${boardState[a]} wins!`;
      gameActive = false;
      return;
    }
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  }
}

function resetGame() {
  currentPlayer = "X";
  boardState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  cells.forEach(cell => cell.textContent = "");
  statusText.textContent = `Player X's turn`;
}

function switchMode() {
  singlePlayer = !singlePlayer;
  modeBtn.textContent = `Switch Mode (${singlePlayer ? "Single" : "Two"} Player)`;
  resetGame();
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
modeBtn.addEventListener("click", switchMode);
