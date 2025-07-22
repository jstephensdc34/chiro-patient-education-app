import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, User } from "lucide-react";
import { Patient } from "@/hooks/usePostureData";

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onCreatePatient: (patientData: Omit<Patient, 'id' | 'created_at'>) => Promise<Patient | null>;
}

export const PatientSelector = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  onCreatePatient 
}: PatientSelectorProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    date_of_birth: '',
    gender: ''
  });

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPatient.name.trim()) return;

    const created = await onCreatePatient({
      name: newPatient.name.trim(),
      date_of_birth: newPatient.date_of_birth || undefined,
      gender: newPatient.gender || undefined
    });

    if (created) {
      setIsCreateDialogOpen(false);
      setNewPatient({ name: '', date_of_birth: '', gender: '' });
      onSelectPatient(created);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPatient ? (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{selectedPatient.name}</h3>
                {selectedPatient.date_of_birth && (
                  <p className="text-sm text-muted-foreground">
                    DOB: {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
                  </p>
                )}
                {selectedPatient.gender && (
                  <p className="text-sm text-muted-foreground">
                    Gender: {selectedPatient.gender}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectPatient(null as any)}
              >
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Select onValueChange={(value) => {
              const patient = patients.find(p => p.id === value);
              if (patient) onSelectPatient(patient);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an existing patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePatient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Patient name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newPatient.date_of_birth}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={newPatient.gender} 
                      onValueChange={(value) => setNewPatient(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Patient</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};