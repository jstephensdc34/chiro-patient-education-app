
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientInfo } from "@/types";

interface PatientInfoFormProps {
  patient: PatientInfo & { email?: string };
  onPatientInfoChange: (key: keyof (PatientInfo & { email?: string }), value: string | number) => void;
}

export const PatientInfoForm = ({ patient, onPatientInfoChange }: PatientInfoFormProps) => {
  return (
    <Card>
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="patientName">Patient Name*</Label>
            <Input
              id="patientName"
              value={patient.name}
              onChange={(e) => onPatientInfoChange("name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patientEmail">Email Address</Label>
            <Input
              id="patientEmail"
              type="email"
              value={patient.email || ""}
              onChange={(e) => onPatientInfoChange("email", e.target.value)}
              placeholder="patient@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patientAge">Age</Label>
            <Input
              id="patientAge"
              type="number"
              value={patient.age || ""}
              onChange={(e) => onPatientInfoChange("age", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patientGender">Gender</Label>
            <select
              id="patientGender"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={patient.gender}
              onChange={(e) => onPatientInfoChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reportDate">Report Date</Label>
            <Input
              id="reportDate"
              type="date"
              value={patient.date}
              onChange={(e) => onPatientInfoChange("date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
