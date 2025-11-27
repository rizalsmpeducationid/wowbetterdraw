export class DrawingBoard {
    constructor(canvas) {
        this.drawing = false;
        this.brushColor = "#000000";
        this.brushSize = 5;
        this.eraser = false;
        this.canvas = canvas;
        const context = canvas.getContext("2d");
        if (!context)
            throw new Error("Canvas not supported.");
        this.ctx = context;
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.registerEvents();
    }
    resizeCanvas() {
        var _a;
        const temp = document.createElement("canvas");
        temp.width = this.canvas.width;
        temp.height = this.canvas.height;
        (_a = temp.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(this.canvas, 0, 0);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60;
        this.ctx.drawImage(temp, 0, 0);
    }
    registerEvents() {
        this.canvas.addEventListener("mousedown", () => this.startDraw());
        this.canvas.addEventListener("mouseup", () => this.stopDraw());
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    }
    setColor(color) {
        this.brushColor = color;
    }
    setBrushSize(size) {
        this.brushSize = size;
    }
    setEraser(active) {
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
    startDraw() {
        this.drawing = true;
    }
    stopDraw() {
        this.drawing = false;
        this.ctx.beginPath();
    }
    draw(e) {
        if (!this.drawing)
            return;
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
