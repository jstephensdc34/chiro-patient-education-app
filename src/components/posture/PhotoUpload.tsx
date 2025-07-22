
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Eye } from "lucide-react";
import { PosturePhoto } from "@/hooks/usePostureData";
import { useSignedUrls } from "@/hooks/useSignedUrls";

interface PhotoUploadProps {
  assessmentId: string;
  existingPhotos: PosturePhoto[];
  onUploadPhoto: (assessmentId: string, file: File, photoType: 'side' | 'front' | 'back') => Promise<any>;
}

export const PhotoUpload = ({ assessmentId, existingPhotos, onUploadPhoto }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { generateSignedUrl, isLoadingUrl, getUrlFromCache } = useSignedUrls('posture-photos');

  const photoTypes = [
    { key: 'side', label: 'Side View', description: 'Profile view from the side' },
    { key: 'front', label: 'Front View', description: 'Frontal view facing forward' },
    { key: 'back', label: 'Back View', description: 'Posterior view from behind' }
  ] as const;

  const loadPhotoUrl = async (photo: PosturePhoto) => {
    const cachedUrl = getUrlFromCache(photo.file_path);
    if (cachedUrl) {
      setPhotoUrls(prev => ({ ...prev, [photo.id]: cachedUrl }));
      return cachedUrl;
    }

    const url = await generateSignedUrl(photo.file_path);
    if (url) {
      setPhotoUrls(prev => ({ ...prev, [photo.id]: url }));
    }
    return url;
  };

  useEffect(() => {
    // Load signed URLs for all existing photos
    existingPhotos.forEach(photo => {
      if (!photoUrls[photo.id]) {
        loadPhotoUrl(photo);
      }
    });
  }, [existingPhotos]);

  const handleFileSelect = async (file: File, photoType: 'side' | 'front' | 'back') => {
    if (!file) return;

    setUploading(photoType);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onUploadPhoto(assessmentId, file, photoType);
      setUploadProgress(100);
      
      // Clear the file input
      if (fileInputRefs.current[photoType]) {
        fileInputRefs.current[photoType]!.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(null);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const getPhotoForType = (type: string) => {
    return existingPhotos.find(photo => photo.photo_type === type);
  };

  const handleViewPhoto = async (photo: PosturePhoto) => {
    const url = await loadPhotoUrl(photo);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photo Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {photoTypes.map(({ key, label, description }) => {
            const existingPhoto = getPhotoForType(key);
            const isUploading = uploading === key;
            const isLoadingUrl = existingPhoto ? isLoadingUrl(existingPhoto.file_path) : false;
            const photoUrl = existingPhoto ? photoUrls[existingPhoto.id] : null;

            return (
              <div key={key} className="space-y-3">
                <div className="text-center">
                  <h4 className="font-medium">{label}</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                {existingPhoto ? (
                  <div className="relative">
                    <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                      {isLoadingUrl ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading...</div>
                        </div>
                      ) : photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`${label} posture photo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">Failed to load</div>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Uploaded
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleViewPhoto(existingPhoto)}
                        disabled={isLoadingUrl || !photoUrl}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRefs.current[key]?.click()}
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center p-4 hover:border-muted-foreground/50 transition-colors">
                    {isUploading ? (
                      <div className="w-full space-y-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-center">Uploading... {uploadProgress}%</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileInputRefs.current[key]?.click()}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Photo
                        </Button>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={(el) => fileInputRefs.current[key] = el}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file, key as 'side' | 'front' | 'back');
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Tips for better photos:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Ensure good lighting and clear visibility of posture</li>
            <li>Patient should wear form-fitting clothing</li>
            <li>Keep camera at shoulder height for side/front views</li>
            <li>Use a plain background when possible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
