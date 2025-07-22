
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Ruler, 
  Move, 
  RotateCcw, 
  Grid3x3, 
  Crosshair, 
  Download,
  Trash2,
  Save
} from 'lucide-react';

interface Measurement {
  id: string;
  type: 'angle' | 'distance' | 'landmark';
  points: { x: number; y: number }[];
  value?: number;
  unit?: string;
  label: string;
  color: string;
}

interface PhotoAnnotationProps {
  photoUrl: string;
  photoType: string;
  onSaveMeasurement: (measurement: Omit<Measurement, 'id'>) => void;
  existingMeasurements?: Measurement[];
}

export const PhotoAnnotation = ({ 
  photoUrl, 
  photoType, 
  onSaveMeasurement, 
  existingMeasurements = [] 
}: PhotoAnnotationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'angle' | 'distance' | 'landmark'>('select');
  const [measurements, setMeasurements] = useState<Measurement[]>(existingMeasurements);
  const [currentMeasurement, setCurrentMeasurement] = useState<Partial<Measurement> | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showPlumbLine, setShowPlumbLine] = useState(false);
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageLoaded(true);
      if (imageRef.current) {
        imageRef.current.src = photoUrl;
      }
      drawCanvas();
    };
    image.src = photoUrl;
  }, [photoUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [measurements, showGrid, showPlumbLine, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw plumb line if enabled
    if (showPlumbLine) {
      drawPlumbLine(ctx, canvas.width, canvas.height);
    }

    // Draw measurements
    measurements.forEach(measurement => {
      drawMeasurement(ctx, measurement);
    });

    // Draw current measurement being created
    if (currentMeasurement && currentMeasurement.points) {
      drawMeasurement(ctx, currentMeasurement as Measurement);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([5, 5]);

    const gridSize = Math.min(width, height) / 20;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawPlumbLine = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);

    // Vertical plumb line in center
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const drawMeasurement = (ctx: CanvasRenderingContext2D, measurement: Measurement) => {
    const { points, type, color, label, value, unit } = measurement;
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    if (type === 'angle' && points.length >= 3) {
      // Draw angle measurement
      const [p1, p2, p3] = points;
      
      // Draw lines
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.stroke();

      // Draw angle arc
      const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 30, angle1, angle2);
      ctx.stroke();

      // Draw label
      ctx.fillText(`${label}: ${value}°`, p2.x + 10, p2.y - 10);
    } else if (type === 'distance' && points.length >= 2) {
      // Draw distance measurement
      const [p1, p2] = points;
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Draw endpoints
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4, 0, 2 * Math.PI);
      ctx.arc(p2.x, p2.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.fillText(`${label}: ${value}${unit}`, midX + 10, midY - 10);
    } else if (type === 'landmark' && points.length >= 1) {
      // Draw landmark
      const [p1] = points;
      
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw crosshair
      ctx.beginPath();
      ctx.moveTo(p1.x - 10, p1.y);
      ctx.lineTo(p1.x + 10, p1.y);
      ctx.moveTo(p1.x, p1.y - 10);
      ctx.lineTo(p1.x, p1.y + 10);
      ctx.stroke();

      // Draw label
      ctx.fillText(label, p1.x + 10, p1.y - 10);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (!currentMeasurement) {
      // Start new measurement
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      const color = colors[measurements.length % colors.length];
      
      setCurrentMeasurement({
        type: activeTool,
        points: [{ x, y }],
        label: `${activeTool} ${measurements.length + 1}`,
        color
      });
    } else {
      // Add point to current measurement
      const updatedPoints = [...(currentMeasurement.points || []), { x, y }];
      
      let completed = false;
      let value = 0;
      let unit = '';

      if (activeTool === 'angle' && updatedPoints.length === 3) {
        // Calculate angle
        const [p1, p2, p3] = updatedPoints;
        const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
        const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
        let angle = Math.abs(angle2 - angle1) * (180 / Math.PI);
        if (angle > 180) angle = 360 - angle;
        
        value = Math.round(angle);
        unit = '°';
        completed = true;
      } else if (activeTool === 'distance' && updatedPoints.length === 2) {
        // Calculate distance (in pixels, would need calibration for real units)
        const [p1, p2] = updatedPoints;
        const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        
        value = Math.round(distance);
        unit = 'px';
        completed = true;
      } else if (activeTool === 'landmark' && updatedPoints.length === 1) {
        completed = true;
      }

      const updatedMeasurement = {
        ...currentMeasurement,
        points: updatedPoints,
        value,
        unit
      };

      setCurrentMeasurement(updatedMeasurement);

      if (completed) {
        const newMeasurement = {
          id: Date.now().toString(),
          ...updatedMeasurement
        } as Measurement;
        
        setMeasurements(prev => [...prev, newMeasurement]);
        setCurrentMeasurement(null);
        setActiveTool('select');
      }
    }
  };

  const handleSaveAnnotation = () => {
    measurements.forEach(measurement => {
      onSaveMeasurement(measurement);
    });
  };

  const handleClearAll = () => {
    setMeasurements([]);
    setCurrentMeasurement(null);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `posture-analysis-${photoType}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Photo Analysis - {photoType}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={activeTool === 'select' ? 'default' : 'outline'}
              onClick={() => setActiveTool('select')}
            >
              <Move className="h-4 w-4 mr-1" />
              Select
            </Button>
            <Button
              size="sm"
              variant={activeTool === 'angle' ? 'default' : 'outline'}
              onClick={() => setActiveTool('angle')}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Angle
            </Button>
            <Button
              size="sm"
              variant={activeTool === 'distance' ? 'default' : 'outline'}
              onClick={() => setActiveTool('distance')}
            >
              <Ruler className="h-4 w-4 mr-1" />
              Distance
            </Button>
            <Button
              size="sm"
              variant={activeTool === 'landmark' ? 'default' : 'outline'}
              onClick={() => setActiveTool('landmark')}
            >
              <Crosshair className="h-4 w-4 mr-1" />
              Landmark
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex gap-1">
            <Button
              size="sm"
              variant={showGrid ? 'default' : 'outline'}
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3x3 className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={showPlumbLine ? 'default' : 'outline'}
              onClick={() => setShowPlumbLine(!showPlumbLine)}
            >
              Plumb Line
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={handleSaveAnnotation}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Active measurements */}
        {measurements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {measurements.map((measurement) => (
              <Badge key={measurement.id} variant="outline" style={{ borderColor: measurement.color }}>
                {measurement.label}: {measurement.value}{measurement.unit}
              </Badge>
            ))}
          </div>
        )}

        {/* Canvas container */}
        <div className="relative border rounded-lg overflow-hidden bg-white">
          <img
            ref={imageRef}
            src={photoUrl}
            alt="Posture analysis"
            className="max-w-full h-auto"
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="absolute inset-0 cursor-crosshair"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Angle:</strong> Click 3 points to measure angle (vertex in middle)</li>
            <li><strong>Distance:</strong> Click 2 points to measure distance</li>
            <li><strong>Landmark:</strong> Click 1 point to place anatomical landmark</li>
            <li><strong>Grid:</strong> Toggle reference grid overlay</li>
            <li><strong>Plumb Line:</strong> Toggle vertical reference line</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
