import { DrawingBoard } from "./drawing.js";

const canvas = document.getElementById("drawingCanvas");
const board = new DrawingBoard(canvas);

// UI Controls
document.getElementById("colorPicker").addEventListener("input", (e) => {
  board.setColor(e.target.value);
});

document.getElementById("brushSize").addEventListener("change", (e) => {
  board.setBrushSize(Number(e.target.value));
});

document.getElementById("penBtn").addEventListener("click", () => {
  board.setEraser(false);
});

document.getElementById("eraserBtn").addEventListener("click", () => {
  board.setEraser(true);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  board.clear();
});

document.getElementById("saveBtn").addEventListener("click", () => {
  board.save();
});
