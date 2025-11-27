import React, { useRef, useEffect, useState } from "react";

type Tool = "brush"|"eraser";

export default function App(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [color,setColor] = useState("#111111");
  const [size,setSize] = useState(6);
  const [tool,setTool] = useState<Tool>("brush");
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(()=>{
    const cv = canvasRef.current!;
    const fit = ()=> {
      cv.width = Math.max(800, Math.floor(window.innerWidth * 0.7));
      cv.height = Math.max(500, Math.floor(window.innerHeight * 0.7));
      const ctx = cv.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,cv.width,cv.height);
    };
    fit();
    window.addEventListener('resize', fit);
    return ()=> window.removeEventListener('resize', fit);
  },[]);

  useEffect(()=>{
    if(index >=0 && index < history.length){
      const img = new Image();
      img.onload = ()=> {
        const cv = canvasRef.current!;
        const ctx = cv.getContext("2d")!;
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
      };
      img.src = history[index];
    }
  },[index,history]);

  // draw handlers
  useEffect(()=>{
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    let drawing = false;
    let last:{x:number,y:number}|null = null;
    const getPos = (e:MouseEvent|TouchEvent) => {
      const r = cv.getBoundingClientRect();
      if((e as TouchEvent).touches) {
        const t = (e as TouchEvent).touches[0];
        return { x: t.clientX - r.left, y: t.clientY - r.top};
      }
      const m = e as MouseEvent;
      return { x: m.clientX - r.left, y: m.clientY - r.top};
    };
    const start = (e:any) => {
      drawing = true;
      last = getPos(e);
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = size;
      ctx.globalCompositeOperation = (tool==="eraser") ? "destination-out" : "source-over";
      ctx.strokeStyle = color;
      ctx.moveTo(last.x,last.y);
    };
    const move = (e:any)=>{
      if(!drawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
      last = p;
    };
    const end = ()=>{
      if(!drawing) return;
      drawing = false;
      ctx.closePath();
      // push history
      setHistory(h=>{
        const next = h.slice(0, index+1);
        next.push(cv.toDataURL());
        setIndex(next.length - 1);
        return next;
      });
    };
    cv.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    cv.addEventListener('touchstart', (e)=>{ e.preventDefault(); start(e); }, {passive:false});
    cv.addEventListener('touchmove', (e)=>{ e.preventDefault(); move(e); }, {passive:false});
    cv.addEventListener('touchend', end);
    return ()=>{
      cv.removeEventListener('mousedown', start);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      cv.removeEventListener('touchstart', ()=>{});
      cv.removeEventListener('touchmove', ()=>{});
    };
  }, [color, size, tool, index]);

  const undo = ()=> setIndex(i => Math.max(0, i-1));
  const redo = ()=> setIndex(i => Math.min(history.length-1, i+1));
  const save = ()=> {
    const cv = canvasRef.current!;
    const a = document.createElement('a');
    a.href = cv.toDataURL();
    a.download = `drawing-react-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">MyDrawingSite — React</h1>
          <div className="flex items-center gap-3">
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
            <input type="range" min={1} max={120} value={size} onChange={e=>setSize(Number(e.target.value))} />
            <select value={tool} onChange={e => setTool(e.target.value as Tool)}>
              <option value="brush">Brush</option>
              <option value="eraser">Eraser</option>
            </select>
            <button onClick={undo} className="px-3 py-1 border rounded">Undo</button>
            <button onClick={redo} className="px-3 py-1 border rounded">Redo</button>
            <button onClick={save} className="px-3 py-1 border rounded">Save</button>
          </div>
        </div>
        <div className="p-4">
          <canvas ref={canvasRef} className="w-full rounded bg-white" />
        </div>
      </div>
    </div>
  );
}

