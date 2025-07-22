import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PatientSelector } from "@/components/posture/PatientSelector";
import { AssessmentCreator } from "@/components/posture/AssessmentCreator";
import { PhotoUpload } from "@/components/posture/PhotoUpload";
import { MeasurementTracker } from "@/components/posture/MeasurementTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePostureData, Patient, type PostureAssessment } from "@/hooks/usePostureData";
import { useAuth } from "@/components/auth/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Camera, Users, BarChart3, ArrowLeft } from "lucide-react";
import { PhotoAnnotation } from "@/components/posture/PhotoAnnotation";
import { PhotoComparison } from "@/components/posture/PhotoComparison";
import { GuidedMeasurement, ProtocolSelector } from "@/components/posture/GuidedMeasurement";

const PostureAssessment = () => {
  const { isAuthenticated } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<PostureAssessment | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisMode, setAnalysisMode] = useState<'photos' | 'measurements' | 'analysis' | 'annotation' | 'comparison' | 'guided'>('photos');
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);

  const {
    patients,
    assessments,
    isLoading,
    createPatient,
    createAssessment,
    uploadPhoto,
    addMeasurement,
    refetch
  } = usePostureData();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground">Please sign in to access posture assessment features.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  const handleCreateAssessment = async (data: any) => {
    const newAssessment = await createAssessment(data);
    if (newAssessment) {
      // Find the full assessment with relations
      const fullAssessment = assessments.find(a => a.id === newAssessment.id);
      if (fullAssessment) {
        setActiveAssessment(fullAssessment);
        setActiveTab("photos");
      }
    }
  };

  const handleAnnotationSave = (measurement: any) => {
    addMeasurement({
      assessment_id: activeAssessment!.id,
      measurement_type: measurement.label,
      value: measurement.value || 0,
      unit: measurement.unit || 'px',
      notes: `Annotated measurement: ${measurement.type}`
    });
  };

  const handleProtocolComplete = (measurements: any[]) => {
    measurements.forEach(measurement => {
      if (measurement) {
        addMeasurement({
          assessment_id: activeAssessment!.id,
          ...measurement
        });
      }
    });
    setSelectedProtocol(null);
    setAnalysisMode('measurements');
  };

  const patientAssessments = selectedPatient 
    ? assessments.filter(a => a.patient_id === selectedPatient.id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {activeAssessment && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveAssessment(null);
                    setAnalysisMode('photos');
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">
                Posture Assessment
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Comprehensive posture analysis and tracking for patient care
            </p>
          </div>

          {activeAssessment ? (
            /* Assessment Detail View */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl">Assessment for {activeAssessment.patient?.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activeAssessment.assessment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {activeAssessment.photos?.length || 0} photos • {activeAssessment.measurements?.length || 0} measurements
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Tabs value={analysisMode} onValueChange={(value: any) => setAnalysisMode(value)}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="measurements">Measurements</TabsTrigger>
                  <TabsTrigger value="annotation">Annotation</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="guided">Guided</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="photos" className="space-y-6">
                  <PhotoUpload
                    assessmentId={activeAssessment.id}
                    existingPhotos={activeAssessment.photos || []}
                    onUploadPhoto={uploadPhoto}
                  />
                </TabsContent>

                <TabsContent value="measurements" className="space-y-6">
                  <MeasurementTracker
                    assessmentId={activeAssessment.id}
                    measurements={activeAssessment.measurements || []}
                    onAddMeasurement={addMeasurement}
                  />
                </TabsContent>

                <TabsContent value="annotation" className="space-y-6">
                  <div className="grid gap-6">
                    {activeAssessment.photos?.map((photo) => (
                      <PhotoAnnotation
                        key={photo.id}
                        photoUrl={`/api/photo/${photo.file_path}`}
                        photoType={photo.photo_type}
                        onSaveMeasurement={handleAnnotationSave}
                      />
                    ))}
                    {(!activeAssessment.photos || activeAssessment.photos.length === 0) && (
                      <Card>
                        <CardContent className="py-8">
                          <div className="text-center">
                            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              No photos available for annotation
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Upload photos in the Photos tab first
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-6">
                  <PhotoComparison
                    assessments={patientAssessments}
                    onExport={() => {
                      // Export functionality would be implemented here
                      console.log('Export comparison');
                    }}
                  />
                </TabsContent>

                <TabsContent value="guided" className="space-y-6">
                  {selectedProtocol ? (
                    <GuidedMeasurement
                      protocol={selectedProtocol}
                      onMeasurementComplete={handleProtocolComplete}
                    />
                  ) : (
                    <ProtocolSelector onSelectProtocol={setSelectedProtocol} />
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Posture Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          AI-powered analysis coming soon. Use the annotation and guided measurement tools for manual analysis.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            /* Overview */
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-6">
                <PatientSelector
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelectPatient={setSelectedPatient}
                  onCreatePatient={createPatient}
                />

                {selectedPatient && (
                  <AssessmentCreator
                    patient={selectedPatient}
                    onCreateAssessment={handleCreateAssessment}
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                {selectedPatient ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Assessment History for {selectedPatient.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patientAssessments.length > 0 ? (
                        <div className="space-y-3">
                          {patientAssessments.map((assessment) => (
                            <div 
                              key={assessment.id}
                              className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => setActiveAssessment(assessment)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {new Date(assessment.assessment_date).toLocaleDateString()}
                                  </p>
                                  {assessment.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {assessment.notes.substring(0, 100)}
                                      {assessment.notes.length > 100 ? '...' : ''}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline">
                                    {assessment.photos?.length || 0} photos
                                  </Badge>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {assessment.measurements?.length || 0} measurements
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No assessments yet for this patient
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Create a new assessment to get started
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Recent Assessments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessments.length > 0 ? (
                        <div className="space-y-3">
                          {assessments.slice(0, 5).map((assessment) => (
                            <div 
                              key={assessment.id}
                              className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedPatient(assessment.patient!);
                                setActiveAssessment(assessment);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{assessment.patient?.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(assessment.assessment_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {assessment.photos?.length || 0} photos • {assessment.measurements?.length || 0} measurements
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No assessments created yet
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Select a patient to create your first assessment
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostureAssessment;
