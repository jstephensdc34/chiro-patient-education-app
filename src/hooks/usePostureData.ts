import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

export interface Patient {
  id: string;
  name: string;
  date_of_birth?: string;
  gender?: string;
  created_at: string;
}

export interface PostureAssessment {
  id: string;
  patient_id: string;
  assessment_date: string;
  notes?: string;
  patient?: Patient;
  photos?: PosturePhoto[];
  measurements?: PostureMeasurement[];
}

export interface PosturePhoto {
  id: string;
  assessment_id: string;
  photo_type: 'side' | 'front' | 'back';
  file_path: string;
  file_name: string;
}

export interface PostureMeasurement {
  id: string;
  assessment_id: string;
  measurement_type: string;
  value: number;
  unit: string;
  severity?: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
  notes?: string;
}

export const usePostureData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<PostureAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients.",
        variant: "destructive",
      });
    }
  };

  const fetchAssessments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('posture_assessments')
        .select(`
          *,
          patient:patients(*),
          photos:posture_photos(*),
          measurements:posture_measurements(*)
        `)
        .eq('user_id', user.id)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      setAssessments((data || []) as PostureAssessment[]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessments.",
        variant: "destructive",
      });
    }
  };

  const createPatient = async (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          ...patientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setPatients(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Patient created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create patient.",
        variant: "destructive",
      });
      return null;
    }
  };

  const createAssessment = async (assessmentData: {
    patient_id: string;
    assessment_date: string;
    notes?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('posture_assessments')
        .insert({
          ...assessmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssessments();
      toast({
        title: "Success",
        description: "Assessment created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment.",
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadPhoto = async (assessmentId: string, file: File, photoType: 'side' | 'front' | 'back') => {
    if (!user) return null;

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${assessmentId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posture-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('posture_photos')
        .insert({
          assessment_id: assessmentId,
          photo_type: photoType,
          file_path: filePath,
          file_name: fileName,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAssessments();
      toast({
        title: "Success",
        description: "Photo uploaded successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo.",
        variant: "destructive",
      });
      return null;
    }
  };

  const addMeasurement = async (measurementData: Omit<PostureMeasurement, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('posture_measurements')
        .insert(measurementData)
        .select()
        .single();

      if (error) throw error;

      await fetchAssessments();
      toast({
        title: "Success",
        description: "Measurement added successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast({
        title: "Error",
        description: "Failed to add measurement.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchPatients(), fetchAssessments()])
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return {
    patients,
    assessments,
    isLoading,
    createPatient,
    createAssessment,
    uploadPhoto,
    addMeasurement,
    refetch: () => {
      fetchPatients();
      fetchAssessments();
    }
  };
};