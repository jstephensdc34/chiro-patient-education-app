import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Ruler, Plus, Trash2 } from "lucide-react";
import { PostureMeasurement } from "@/hooks/usePostureData";

interface MeasurementTrackerProps {
  assessmentId: string;
  measurements: PostureMeasurement[];
  onAddMeasurement: (measurementData: Omit<PostureMeasurement, 'id'>) => Promise<any>;
}

const commonMeasurements = [
  { type: 'Forward Head Posture', unit: 'cm', description: 'Distance of head forward from plumb line' },
  { type: 'Shoulder Height Difference', unit: 'cm', description: 'Height difference between shoulders' },
  { type: 'Pelvic Tilt Angle', unit: 'degrees', description: 'Anterior/posterior pelvic tilt angle' },
  { type: 'Cervical Lordosis', unit: 'degrees', description: 'Cervical spine curvature angle' },
  { type: 'Thoracic Kyphosis', unit: 'degrees', description: 'Thoracic spine curvature angle' },
  { type: 'Lumbar Lordosis', unit: 'degrees', description: 'Lumbar spine curvature angle' },
  { type: 'Head Rotation', unit: 'degrees', description: 'Head rotation from neutral' },
  { type: 'Shoulder Protraction', unit: 'cm', description: 'Forward shoulder position' },
];

export const MeasurementTracker = ({ 
  assessmentId, 
  measurements, 
  onAddMeasurement 
}: MeasurementTrackerProps) => {
  const [newMeasurement, setNewMeasurement] = useState({
    measurement_type: '',
    value: '',
    unit: 'cm',
    severity: '',
    notes: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMeasurement.measurement_type || !newMeasurement.value) return;

    setIsAdding(true);

    try {
      await onAddMeasurement({
        assessment_id: assessmentId,
        measurement_type: newMeasurement.measurement_type,
        value: parseFloat(newMeasurement.value),
        unit: newMeasurement.unit,
        severity: newMeasurement.severity as any || undefined,
        notes: newMeasurement.notes.trim() || undefined
      });

      setNewMeasurement({
        measurement_type: '',
        value: '',
        unit: 'cm',
        severity: '',
        notes: ''
      });
    } finally {
      setIsAdding(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Mild': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Posture Measurements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Measurements */}
        {measurements.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Recorded Measurements</h4>
            <div className="grid gap-3">
              {measurements.map((measurement) => (
                <div key={measurement.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{measurement.measurement_type}</h5>
                    {measurement.severity && (
                      <Badge 
                        variant="outline" 
                        className={getSeverityColor(measurement.severity)}
                      >
                        {measurement.severity}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">
                      {measurement.value} {measurement.unit}
                    </span>
                  </div>
                  {measurement.notes && (
                    <p className="text-sm text-muted-foreground">{measurement.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Ruler className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No measurements recorded yet</p>
            <p className="text-sm">Add measurements below to track posture metrics</p>
          </div>
        )}

        <Separator />

        {/* Add New Measurement */}
        <div className="space-y-4">
          <h4 className="font-medium">Add New Measurement</h4>
          
          <form onSubmit={handleAddMeasurement} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="measurement-type">Measurement Type</Label>
                <Select 
                  value={newMeasurement.measurement_type}
                  onValueChange={(value) => {
                    setNewMeasurement(prev => ({ ...prev, measurement_type: value }));
                    // Auto-set unit based on measurement type
                    const measurement = commonMeasurements.find(m => m.type === value);
                    if (measurement) {
                      setNewMeasurement(prev => ({ ...prev, unit: measurement.unit }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select measurement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonMeasurements.map(measurement => (
                      <SelectItem key={measurement.type} value={measurement.type}>
                        <div>
                          <div>{measurement.type}</div>
                          <div className="text-xs text-muted-foreground">
                            {measurement.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="0.0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={newMeasurement.unit}
                    onValueChange={(value) => setNewMeasurement(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="degrees">degrees</SelectItem>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="inches">inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity (Optional)</Label>
              <Select 
                value={newMeasurement.severity}
                onValueChange={(value) => setNewMeasurement(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Mild">Mild</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurement-notes">Notes (Optional)</Label>
              <Textarea
                id="measurement-notes"
                value={newMeasurement.notes}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this measurement..."
                rows={2}
              />
            </div>

            <Button 
              type="submit" 
              disabled={!newMeasurement.measurement_type || !newMeasurement.value || isAdding}
              className="w-full"
            >
              {isAdding ? 'Adding Measurement...' : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Measurement
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
