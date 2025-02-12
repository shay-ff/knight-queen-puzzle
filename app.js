// Game constants
const globalFalse = [
  1, 4, 7, 10, 12, 14, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37,
  42, 44, 46, 49, 52, 55, 60, 64
];
const path = [
  6, 5, 3, 2, 16, 15, 13, 11, 9, 24, 23, 22, 18, 17, 40, 39, 38, 34, 33, 48, 47,
  45, 43, 41, 56, 54, 53, 51, 50, 63, 62, 61, 59, 58, 57,
];

// Game state
let moves = [],
  reached = [],
  coloured = [];
let ptr;
let chessBoard;
let blocked = false,
  open = true,
  hardMode = false;
let selectedSquare = null;
let moveCount = 0;
let wrongMoves = 0;
let difficulty = "normal";

// Timer state
let startTime;
let timerInterval;
let isRunning = false;

// Create piece images
let QueenImg = document.createElement("img");
let KnightImg = document.createElement("img");

// Setup piece images
QueenImg.id = "queen";
QueenImg.draggable = false;
QueenImg.src = "./assets/blackQueen.png";
QueenImg.className =
  "w-4/5 h-4/5 object-contain transition-transform hover:scale-105";

KnightImg.id = "knight";
KnightImg.draggable = true;
KnightImg.ondragstart = drag;
KnightImg.onclick = handlePieceClick;
KnightImg.src = "./assets/whiteKnight.png";
KnightImg.className =
  "w-4/5 h-4/5 object-contain transition-all cursor-pointer hover:scale-105";

// Game functions
function celebrate() {
  confetti({
    particleCount: 300,
    spread: 90,
    origin: { x: 0, y: 0.9 },
  });
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 1, y: 0.9 },
  });
}

function getRowCol(id) {
  var row = Math.floor((id - 1) / 8) + 1;
  var col = ((id - 1) % 8) + 1;
  return [row, col];
}

function getCord(id) {
  const [row, col] = getRowCol(id);
  let file = "abcdefgh"[col - 1];
  let rank = 9 - row;
  return [file, rank];
}

function isLegalMove(start, end) {
  const [startRow, startCol] = getRowCol(start);
  const [endRow, endCol] = getRowCol(end);

  if (globalFalse.includes(end)) return false;

  let dx = [2, 1, -1, -2, -2, -1, 1, 2];
  let dy = [1, 2, 2, 1, -1, -2, -2, -1];

  for (let x = 0; x < 8; x++) {
    let new_x = startRow + dx[x];
    let new_y = startCol + dy[x];
    if (new_x === endRow && new_y === endCol) return true;
  }
  return false;
}

// Click and drag handlers
function handlePieceClick(e) {
  const currentSquare = e.target.parentNode;
  if (selectedSquare === currentSquare) {
    deselectSquare();
    return;
  }

  if (selectedSquare) {
    const targetId = parseInt(currentSquare.id);
    const sourceId = parseInt(selectedSquare.id);

    if (isLegalMove(sourceId, targetId)) {
      makeMove(currentSquare);
    } else {
      new Audio("./alerts/decline.mp3").play();
      showInvalidMoveAnimation(currentSquare);
    }
    deselectSquare();
  } else {
    selectSquare(currentSquare);
  }
}

function selectSquare(square) {
  selectedSquare = square;
  square.classList.add("ring-2", "ring-blue-400", "ring-offset-2");
  showLegalMoves(square);
}

function deselectSquare() {
  if (selectedSquare) {
    selectedSquare.classList.remove("ring-2", "ring-blue-400", "ring-offset-2");
    removeLegalMoveHighlights();
    selectedSquare = null;
  }
}

function showLegalMoves(square) {
  const currentId = parseInt(square.id);
  const [startRow, startCol] = getRowCol(currentId);

  let dx = [2, 1, -1, -2, -2, -1, 1, 2];
  let dy = [1, 2, 2, 1, -1, -2, -2, -1];

  for (let i = 0; i < 8; i++) {
    let newRow = startRow + dx[i];
    let newCol = startCol + dy[i];
    let newId = (newRow - 1) * 8 + newCol;

    if (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 8) {
      if (!globalFalse.includes(newId)) {
        const targetSquare = document.getElementById(newId);
        // targetSquare.classList.add("legal-move");
      }
    }
  }
}

function removeLegalMoveHighlights() {
  document.querySelectorAll(".legal-move").forEach((square) => {
    square.classList.remove("legal-move");
  });
}

function makeMove(targetSquare) {
  const knight = document.getElementById("knight");
  startTimer();
  moveCount++;
  updateMoveCounter();

  knight.style.transition = "transform 0.3s ease-out";
  targetSquare.appendChild(knight);
  
  new Audio("./alerts/move-sound.ogg").play();

  if (parseInt(targetSquare.id) === path[ptr]) {
    targetSquare.style.backgroundColor = "#BBF7D0";
    ptr++;
    if (ptr < path.length) {
      showPath();
      deselectSquare();
    } else {
      stopTimer();
      celebrate();
      showVictoryScreen();
    }
  }
}

// UI functions
function showInvalidMoveAnimation(square) {
  square.classList.add("shake");
  setTimeout(() => square.classList.remove("shake"), 500);
}

function updateMoveCounter() {
  const counter = document.getElementById("moveCounter");
  counter.textContent = `Moves: ${moveCount}`;
}

function showVictoryScreen() {
  const victoryScreen = document.createElement("div");
  victoryScreen.className =
    "fixed inset-0 bg-black/50 flex items-center justify-center";
  victoryScreen.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold text-center mb-4">Puzzle Completed!</h2>
            <div class="space-y-2 text-center mb-4">
                <p>Time: ${document.getElementById("stopwatch").textContent}</p>
                <p>Moves: ${moveCount}</p>
            </div>
            <div class="flex justify-center gap-4">
                <button onclick="resetBoard()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Play Again
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Close
                </button>
            </div>
        </div>
    `;
  document.body.appendChild(victoryScreen);
}

// Timer functions
function formatTime(elapsed) {
  const hours = String(Math.floor(elapsed / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(
    Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(Math.floor((elapsed % (1000 * 60)) / 1000)).padStart(
    2,
    "0"
  );
  return `${hours}:${minutes}:${seconds}`;
}

function updateTimer() {
  const elapsed = Date.now() - startTime;
  document.getElementById("stopwatch").textContent = formatTime(elapsed);
}

function startTimer() {
  if (!isRunning) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    isRunning = true;
  }
}

function stopTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    const elapsed = Date.now() - startTime;
    document.getElementById("stopwatch").textContent = formatTime(elapsed);
    isRunning = false;
  }
}

function resetTimer() {
  stopTimer();
  document.getElementById("stopwatch").textContent = "00:00:00";
  startTime = null;
}

// Board functions
function showPath() {
  const currDiv = document.getElementById(path[ptr]);
  if (currDiv) {
    if(difficulty !== "expert") {
      currDiv.style.backgroundColor = "#fdf718";
    }
  }
}

function showBlocked() {
  blocked = !blocked;
  globalFalse.forEach((id) => {
    const element = document.getElementById(id);
    const [row, col] = getRowCol(id);
    if (blocked) {
      element.style.border = "1px solid rgb(209, 213, 219)";
      const isLight = (row + col) % 2 === 0;
      element.style.backgroundColor = isLight ? "#FEE2E2" : "#FECACA";
      element.style.border = "none";
    } else {
      const isLight = (row + col) % 2 === 0;
      element.style.backgroundColor = isLight ? "#F3F4F6" : "#D1D5DB";
      element.style.border = "none";
    }
  });
  document.getElementById("blockedDot").style.backgroundColor = blocked
    ? "#EF4444"
    : "#22C55E";
}

// Drag and drop functions
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  const knight = document.getElementById(data);
  const currDiv = knight.parentNode;
  const currDivId = parseInt(currDiv.id);

  if (ev.target && ev.target.id) {
    const targetDivId = parseInt(ev.target.id);

    if (isLegalMove(currDivId, targetDivId)) {
      makeMove(ev.target);
    } else {
      // If the knight is dropped on the same square where it was picked up, don't increment `wrongMoves`
      // suggest suitable changes
      if(currDivId !== targetDivId) {
        wrongMoves++;
      }
      console.log(wrongMoves);

      // Show message based on difficulty
      if (difficulty === "hard" && wrongMoves >= 3) {
        showTryAgainPopup("You made 3 wrong moves!", "Go again!");
        resetBoard();
      } else if (difficulty === "expert") {
        showTryAgainPopup("You made a wrong move!", "Go Again!");
        resetBoard();
      }
      // Play error sound and show invalid move animation
      new Audio("./alerts/decline.mp3").play();
      showInvalidMoveAnimation(ev.target);
    }
  }
}


// Function to show the popup
function showTryAgainPopup(title, message) {
  const tryAgain = document.createElement("div");
  tryAgain.className = "fixed inset-0 bg-black/50 flex items-center justify-center";
  tryAgain.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold text-center mb-4">${title}</h2>
        <p class="text-center mb-4">${message}</p>
        <div class="flex justify-center gap-4">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600">
                Yes
            </button>
        </div>
    </div>
  `;
  document.body.appendChild(tryAgain);
}
 

function initBoard() {
  moveCount = 0;
  ptr = 0;
  updateMoveCounter();
  resetTimer();

  chessBoard = document.querySelector(".chess-board");
  chessBoard.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.ondrop = drop;
      square.ondragover = allowDrop;
      square.onclick = handleSquareClick;
      square.className =
        "square transition-colors duration-200 flex items-center justify-center";
      square.id = row * 8 + col + 1;

      if ((row + col) % 2 === 0) {
        square.classList.add("bg-gray-100");
      } else {
        square.classList.add("bg-gray-300");
      }
      chessBoard.appendChild(square);
    }
  }

  let squares = document.querySelectorAll(".square");
  squares[3 * 8 + 3].appendChild(QueenImg);
  squares[7].appendChild(KnightImg);
  // make the first div green
  squares[7].style.backgroundColor = "#BBF7D0";
  showPath();
}

function handleSquareClick(e) {
  if (selectedSquare && e.target !== KnightImg) {
    const targetSquare = e.target.classList.contains("square")
      ? e.target
      : e.target.parentNode;
    if (isLegalMove(parseInt(selectedSquare.id), parseInt(targetSquare.id))) {
      makeMove(targetSquare);
    } else {
      new Audio("./alerts/decline.mp3").play();
      showInvalidMoveAnimation(targetSquare);
    }
    deselectSquare();
  }
}

function changeDifficulty(value) {
  difficulty = value;
  resetBoard();
}

function resetBoard() {
  moves = [];
  reached = [];
  coloured = [];
  wrongMoves = 0;
  window.onload = initBoard();
}

// Initialize the board when the page loads
window.onload = initBoard;
