
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftRight, 
  Layers, 
  TrendingUp, 
  Calendar,
  Download
} from 'lucide-react';
import { PostureAssessment } from '@/hooks/usePostureData';

interface PhotoComparisonProps {
  assessments: PostureAssessment[];
  onExport?: () => void;
}

export const PhotoComparison = ({ assessments, onExport }: PhotoComparisonProps) => {
  const [selectedAssessment1, setSelectedAssessment1] = useState<string>('');
  const [selectedAssessment2, setSelectedAssessment2] = useState<string>('');
  const [selectedPhotoType, setSelectedPhotoType] = useState<'side' | 'front' | 'back'>('side');
  const [overlayOpacity, setOverlayOpacity] = useState([50]);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  const assessment1 = assessments.find(a => a.id === selectedAssessment1);
  const assessment2 = assessments.find(a => a.id === selectedAssessment2);

  const getPhotoUrl = (assessment: PostureAssessment | undefined, photoType: string) => {
    return assessment?.photos?.find(p => p.photo_type === photoType)?.file_path;
  };

  const getMeasurementComparison = () => {
    if (!assessment1 || !assessment2) return [];
    
    const measurements1 = assessment1.measurements || [];
    const measurements2 = assessment2.measurements || [];
    
    const comparisonData = measurements1.map(m1 => {
      const m2 = measurements2.find(m => m.measurement_type === m1.measurement_type);
      return {
        type: m1.measurement_type,
        value1: m1.value,
        value2: m2?.value || 0,
        unit: m1.unit,
        difference: m2 ? m2.value - m1.value : 0,
        percentChange: m2 ? ((m2.value - m1.value) / m1.value) * 100 : 0
      };
    });

    return comparisonData;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Photo Comparison & Progress Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assessment Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Assessment</label>
            <Select value={selectedAssessment1} onValueChange={setSelectedAssessment1}>
              <SelectTrigger>
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map(assessment => (
                  <SelectItem key={assessment.id} value={assessment.id}>
                    {formatDate(assessment.assessment_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Second Assessment</label>
            <Select value={selectedAssessment2} onValueChange={setSelectedAssessment2}>
              <SelectTrigger>
                <SelectValue placeholder="Select assessment" />
              </SelectTrigger>
              <SelectContent>
                {assessments.map(assessment => (
                  <SelectItem key={assessment.id} value={assessment.id}>
                    {formatDate(assessment.assessment_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Photo Type</label>
            <Select value={selectedPhotoType} onValueChange={(value: 'side' | 'front' | 'back') => setSelectedPhotoType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side">Side View</SelectItem>
                <SelectItem value="front">Front View</SelectItem>
                <SelectItem value="back">Back View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparison Mode Controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={comparisonMode === 'side-by-side' ? 'default' : 'outline'}
              onClick={() => setComparisonMode('side-by-side')}
            >
              <ArrowLeftRight className="h-4 w-4 mr-1" />
              Side-by-Side
            </Button>
            <Button
              size="sm"
              variant={comparisonMode === 'overlay' ? 'default' : 'outline'}
              onClick={() => setComparisonMode('overlay')}
            >
              <Layers className="h-4 w-4 mr-1" />
              Overlay
            </Button>
          </div>

          {comparisonMode === 'overlay' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Overlay Opacity:</span>
              <Slider
                value={overlayOpacity}
                onValueChange={setOverlayOpacity}
                max={100}
                min={0}
                step={5}
                className="w-32"
              />
              <span className="text-sm">{overlayOpacity[0]}%</span>
            </div>
          )}

          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Photo Comparison */}
        {assessment1 && assessment2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {formatDate(assessment1.assessment_date)} → {formatDate(assessment2.assessment_date)}
                </span>
              </div>
              <Badge variant="outline">
                {Math.abs(new Date(assessment2.assessment_date).getTime() - new Date(assessment1.assessment_date).getTime()) / (1000 * 60 * 60 * 24)} days apart
              </Badge>
            </div>

            {comparisonMode === 'side-by-side' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-center">
                    {formatDate(assessment1.assessment_date)}
                  </h4>
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    {getPhotoUrl(assessment1, selectedPhotoType) ? (
                      <img
                        src={getPhotoUrl(assessment1, selectedPhotoType)}
                        alt={`${selectedPhotoType} view - ${formatDate(assessment1.assessment_date)}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No photo available</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-center">
                    {formatDate(assessment2.assessment_date)}
                  </h4>
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                    {getPhotoUrl(assessment2, selectedPhotoType) ? (
                      <img
                        src={getPhotoUrl(assessment2, selectedPhotoType)}
                        alt={`${selectedPhotoType} view - ${formatDate(assessment2.assessment_date)}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No photo available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  {getPhotoUrl(assessment1, selectedPhotoType) && (
                    <img
                      src={getPhotoUrl(assessment1, selectedPhotoType)}
                      alt={`${selectedPhotoType} view - ${formatDate(assessment1.assessment_date)}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {getPhotoUrl(assessment2, selectedPhotoType) && (
                    <img
                      src={getPhotoUrl(assessment2, selectedPhotoType)}
                      alt={`${selectedPhotoType} view - ${formatDate(assessment2.assessment_date)}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: overlayOpacity[0] / 100 }}
                    />
                  )}
                </div>
                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <Badge variant="secondary">Base: {formatDate(assessment1.assessment_date)}</Badge>
                  <Badge variant="secondary">Overlay: {formatDate(assessment2.assessment_date)}</Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Measurement Comparison */}
        {assessment1 && assessment2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <h4 className="font-medium">Measurement Changes</h4>
            </div>
            
            <div className="grid gap-3">
              {getMeasurementComparison().map((comparison, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comparison.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {comparison.value1}{comparison.unit} → {comparison.value2}{comparison.unit}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={getChangeColor(comparison.difference)}
                      >
                        {getChangeIcon(comparison.difference)} {Math.abs(comparison.difference).toFixed(1)}{comparison.unit}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getChangeColor(comparison.percentChange)}
                      >
                        {comparison.percentChange.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
