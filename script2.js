const board = document.getElementById("board");
const size = 4;
let boardArray = [];

function createBoard() {
  boardArray = [];
  board.innerHTML = "";
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      board.appendChild(cell);
      row.push(0);
    }
    boardArray.push(row);
  }
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  let emptyCells = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (boardArray[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }
  if (emptyCells.length === 0) return;
  let { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardArray[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  let cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    let i = Math.floor(index / size);
    let j = index % size;
    let value = boardArray[i][j];
    cell.textContent = value === 0 ? "" : value;
    cell.className = "cell";
    if (value) cell.classList.add(`n${value}`);
  });
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val);
  while (arr.length < size) arr.push(0);
  return arr;
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < size; i++) {
    let newRow = slide(boardArray[i]);
    if (!arraysEqual(boardArray[i], newRow)) {
      boardArray[i] = newRow;
      moved = true;
    }
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveRight() {
  let moved = false;
  for (let i = 0; i < size; i++) {
    let reversedRow = boardArray[i].slice().reverse();
    let newRow = slide(reversedRow).reverse();
    if (!arraysEqual(boardArray[i], newRow)) {
      boardArray[i] = newRow;
      moved = true;
    }
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < size; c++) {
    let col = [boardArray[0][c], boardArray[1][c], boardArray[2][c], boardArray[3][c]];
    let newCol = slide(col);
    for (let r = 0; r < size; r++) {
      if (boardArray[r][c] !== newCol[r]) {
        boardArray[r][c] = newCol[r];
        moved = true;
      }
    }
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < size; c++) {
    let col = [boardArray[3][c], boardArray[2][c], boardArray[1][c], boardArray[0][c]];
    let newCol = slide(col).reverse();
    for (let r = 0; r < size; r++) {
      if (boardArray[r][c] !== newCol[r]) {
        boardArray[r][c] = newCol[r];
        moved = true;
      }
    }
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

let touchStartX, touchStartY;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", (e) => {
  let dx = e.changedTouches[0].clientX - touchStartX;
  let dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) moveRight();
    else if (dx < -30) moveLeft();
  } else {
    if (dy > 30) moveDown();
    else if (dy < -30) moveUp();
  }
});

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  document.getElementById("themeToggle").textContent = isDark ? "☀️" : "🌙";
});

createBoard();
