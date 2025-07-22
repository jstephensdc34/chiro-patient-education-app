
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  Target
} from 'lucide-react';

interface MeasurementProtocol {
  id: string;
  name: string;
  description: string;
  steps: {
    title: string;
    instruction: string;
    measurement: string;
    normalRange: string;
    tips: string[];
  }[];
}

interface GuidedMeasurementProps {
  protocol: MeasurementProtocol;
  onMeasurementComplete: (measurements: any[]) => void;
}

const postureProtocols: MeasurementProtocol[] = [
  {
    id: 'cervical-assessment',
    name: 'Cervical Posture Assessment',
    description: 'Comprehensive evaluation of cervical spine alignment and head position',
    steps: [
      {
        title: 'Forward Head Posture',
        instruction: 'Measure the horizontal distance from the plumb line to the tragus of the ear',
        measurement: 'Forward Head Posture',
        normalRange: '0-2.5 cm',
        tips: [
          'Use side view photo for best accuracy',
          'Draw vertical plumb line through C7 vertebra',
          'Measure perpendicular distance to ear tragus',
          'Greater distance indicates more forward head posture'
        ]
      },
      {
        title: 'Cervical Lordosis',
        instruction: 'Measure the angle of cervical spine curvature from C2 to C7',
        measurement: 'Cervical Lordosis',
        normalRange: '31-40 degrees',
        tips: [
          'Use lateral view X-ray if available, or estimate from photo',
          'Draw lines along C2 and C7 vertebral bodies',
          'Measure angle between these lines',
          'Reduced angle indicates loss of cervical lordosis'
        ]
      },
      {
        title: 'Head Tilt',
        instruction: 'Measure lateral head tilt from vertical reference',
        measurement: 'Head Tilt',
        normalRange: '0-2 degrees',
        tips: [
          'Use front view photo',
          'Draw line connecting pupils',
          'Measure angle from horizontal',
          'Note direction of tilt (left/right)'
        ]
      }
    ]
  },
  {
    id: 'shoulder-assessment',
    name: 'Shoulder Posture Assessment',
    description: 'Evaluation of shoulder position and alignment',
    steps: [
      {
        title: 'Shoulder Height',
        instruction: 'Measure vertical difference between left and right shoulder heights',
        measurement: 'Shoulder Height Difference',
        normalRange: '0-1 cm',
        tips: [
          'Use front view photo',
          'Mark highest point of each shoulder',
          'Measure vertical distance between marks',
          'Note which shoulder is higher'
        ]
      },
      {
        title: 'Shoulder Protraction',
        instruction: 'Measure forward position of shoulders from plumb line',
        measurement: 'Shoulder Protraction',
        normalRange: '0-2 cm',
        tips: [
          'Use side view photo',
          'Draw vertical line through ear canal',
          'Measure distance to anterior aspect of shoulder',
          'Greater distance indicates more protraction'
        ]
      }
    ]
  },
  {
    id: 'spinal-assessment',
    name: 'Spinal Alignment Assessment',
    description: 'Comprehensive evaluation of spinal curvatures and alignment',
    steps: [
      {
        title: 'Thoracic Kyphosis',
        instruction: 'Measure the angle of thoracic spine curvature from T1 to T12',
        measurement: 'Thoracic Kyphosis',
        normalRange: '20-45 degrees',
        tips: [
          'Use lateral view photo or X-ray',
          'Draw lines along T1 and T12 vertebral bodies',
          'Measure angle between these lines',
          'Increased angle indicates hyperkyphosis'
        ]
      },
      {
        title: 'Lumbar Lordosis',
        instruction: 'Measure the angle of lumbar spine curvature from L1 to S1',
        measurement: 'Lumbar Lordosis',
        normalRange: '40-60 degrees',
        tips: [
          'Use lateral view photo or X-ray',
          'Draw lines along L1 and S1 vertebral bodies',
          'Measure angle between these lines',
          'Reduced angle indicates loss of lumbar lordosis'
        ]
      },
      {
        title: 'Lateral Spinal Deviation',
        instruction: 'Measure any lateral deviation of the spine from vertical',
        measurement: 'Lateral Spinal Deviation',
        normalRange: '0-1 cm',
        tips: [
          'Use posterior view photo',
          'Draw vertical plumb line',
          'Measure maximum deviation of spine from line',
          'Note direction and level of deviation'
        ]
      }
    ]
  }
];

export const GuidedMeasurement = ({ protocol, onMeasurementComplete }: GuidedMeasurementProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [measurements, setMeasurements] = useState<any[]>([]);

  const handleStepComplete = (measurementData: any) => {
    const newMeasurements = [...measurements];
    newMeasurements[currentStep] = measurementData;
    setMeasurements(newMeasurements);
    
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep);
    setCompletedSteps(newCompletedSteps);
  };

  const handleNext = () => {
    if (currentStep < protocol.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onMeasurementComplete(measurements);
  };

  const currentStepData = protocol.steps[currentStep];
  const progress = ((completedSteps.size) / protocol.steps.length) * 100;
  const isStepComplete = completedSteps.has(currentStep);
  const canProceed = isStepComplete || currentStep === protocol.steps.length - 1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {protocol.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{protocol.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.size}/{protocol.steps.length} steps completed
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Steps Overview */}
        <div className="grid gap-2">
          {protocol.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                index === currentStep
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {completedSteps.has(index) ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{step.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {step.normalRange}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.measurement}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              Step {currentStep + 1}: {currentStepData.title}
            </span>
            {isStepComplete && (
              <Badge variant="default" className="bg-green-600">
                Complete
              </Badge>
            )}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Instruction:</strong> {currentStepData.instruction}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Normal Range:</span>
              <Badge variant="outline">{currentStepData.normalRange}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-medium">Tips:</span>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {currentStepData.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Measurement Input */}
        <div className="p-4 border rounded-lg space-y-3">
          <h4 className="font-medium">Record Measurement</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Value</label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border rounded-md"
                placeholder="Enter value"
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handleStepComplete({
                      measurement_type: currentStepData.measurement,
                      value: value,
                      unit: currentStepData.normalRange.includes('degrees') ? 'degrees' : 'cm',
                      notes: `Measured using guided protocol: ${protocol.name}`
                    });
                  }
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Severity</label>
              <select 
                className="w-full p-2 border rounded-md"
                onChange={(e) => {
                  // Update measurement with severity
                  const currentMeasurement = measurements[currentStep];
                  if (currentMeasurement) {
                    handleStepComplete({
                      ...currentMeasurement,
                      severity: e.target.value
                    });
                  }
                }}
              >
                <option value="">Select severity</option>
                <option value="Normal">Normal</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep === protocol.steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={completedSteps.size !== protocol.steps.length}
              >
                Finish Protocol
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProtocolSelector = ({ onSelectProtocol }: { onSelectProtocol: (protocol: MeasurementProtocol) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Measurement Protocol</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {postureProtocols.map((protocol) => (
            <div
              key={protocol.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectProtocol(protocol)}
            >
              <h4 className="font-medium">{protocol.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{protocol.description}</p>
              <div className="mt-2">
                <Badge variant="outline">{protocol.steps.length} steps</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
