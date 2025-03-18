import React, { useRef, useState, useEffect } from 'react';
import { FaPaintBrush, FaEraser, FaUndo, FaRedo, FaSave } from 'react-icons/fa';
import './DrawingCanvas.css';

const DrawingCanvas = ({ onSave, initialImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(canvas);
  }, []);

  const saveToHistory = (canvas) => {
    const imageData = canvas.toDataURL('image/png');
    if (historyStep + 1 < history.length) {
      setHistory(history.slice(0, historyStep + 1));
    }
    setHistory(prev => [...prev, imageData]);
    setHistoryStep(prev => prev + 1);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      saveToHistory(canvasRef.current);
    }
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const setTool = (toolType) => {
    if (toolType === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    } else {
      context.globalCompositeOperation = 'source-over';
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      const img = new Image();
      img.src = history[historyStep - 1];
      img.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      const img = new Image();
      img.src = history[historyStep + 1];
      img.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
    }
  };

  const handleSave = () => {
    // Convert the canvas data to a Blob
    canvasRef.current.toBlob((blob) => {
      onSave(blob);
    }, 'image/png');
  };

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);

  return (
    <div className="drawing-canvas-container">
      <div className="drawing-toolbar">
        <button onClick={() => setTool('brush')} className="tool-button">
          <FaPaintBrush />
        </button>
        <button onClick={() => setTool('eraser')} className="tool-button">
          <FaEraser />
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="color-picker"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="brush-size"
        />
        <button onClick={undo} className="tool-button" disabled={historyStep <= 0}>
          <FaUndo />
        </button>
        <button onClick={redo} className="tool-button" disabled={historyStep >= history.length - 1}>
          <FaRedo />
        </button>
        <button onClick={handleSave} className="tool-button">
          <FaSave />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="drawing-canvas"
      />
    </div>
  );
};

export default DrawingCanvas; 