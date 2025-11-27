export class DrawingBoard {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private drawing = false;
  private brushColor = "#000000";
  private brushSize = 5;
  private eraser = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas not supported.");
    this.ctx = context;

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.registerEvents();
  }

  private resizeCanvas() {
    const temp = document.createElement("canvas");
    temp.width = this.canvas.width;
    temp.height = this.canvas.height;
    temp.getContext("2d")?.drawImage(this.canvas, 0, 0);

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 60;

    this.ctx.drawImage(temp, 0, 0);
  }

  private registerEvents() {
    this.canvas.addEventListener("mousedown", () => this.startDraw());
    this.canvas.addEventListener("mouseup", () => this.stopDraw());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
  }

  setColor(color: string) {
    this.brushColor = color;
  }

  setBrushSize(size: number) {
    this.brushSize = size;
  }

  setEraser(active: boolean) {
    this.eraser = active;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  save() {
    const link = document.createElement("a");
    link.href = this.canvas.toDataURL("image/png");
    link.download = "drawing.png";
    link.click();
  }

  private startDraw() {
    this.drawing = true;
  }

  private stopDraw() {
    this.drawing = false;
    this.ctx.beginPath();
  }

  private draw(e: MouseEvent) {
    if (!this.drawing) return;

    const x = e.clientX;
    const y = e.clientY - 60;

    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.eraser ? "#ffffff" : this.brushColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
}

