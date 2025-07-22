import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Camera } from "lucide-react";
import { Patient } from "@/hooks/usePostureData";

interface AssessmentCreatorProps {
  patient: Patient;
  onCreateAssessment: (data: {
    patient_id: string;
    assessment_date: string;
    notes?: string;
  }) => Promise<any>;
}

export const AssessmentCreator = ({ patient, onCreateAssessment }: AssessmentCreatorProps) => {
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await onCreateAssessment({
        patient_id: patient.id,
        assessment_date: assessmentDate,
        notes: notes.trim() || undefined
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          New Posture Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAssessment} className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Patient: {patient.name}</p>
            {patient.date_of_birth && (
              <p className="text-sm text-muted-foreground">
                DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment-date">Assessment Date</Label>
            <Input
              id="assessment-date"
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Initial Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any initial observations or notes about the assessment..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? 'Creating Assessment...' : 'Start Assessment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};