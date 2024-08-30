import React, { useRef, useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Whiteboard = ({ roomId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penType, setPenType] = useState('pen');
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = penColor;
    context.lineWidth = penSize;
    context.lineCap = 'round';
  }, [penColor, penSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (penType === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = penSize * 2;
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = penSize;
    }
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Whiteboard</h3>
      <div className="flex space-x-2 mb-2">
        <Select onValueChange={(value) => setPenType(value)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Pen Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pen">Pen</SelectItem>
            <SelectItem value="eraser">Eraser</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          className="w-[100px]"
        />
        <Input
          type="number"
          value={penSize}
          onChange={(e) => setPenSize(Number(e.target.value))}
          min="1"
          max="20"
          className="w-[80px]"
        />
        <Button onClick={clearCanvas}>Clear</Button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="border border-gray-300"
      />
    </div>
  );
};

export default Whiteboard;
