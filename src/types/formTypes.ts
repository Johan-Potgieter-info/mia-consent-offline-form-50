
import { Region } from '../utils/regionDetection';

export interface FormData {
  [key: string]: any;
  id?: string | number; // Allow both for compatibility
  
  // Patient Details
  patientName?: string;
  idNumber?: string;
  maritalStatus?: string;
  gender?: string;
  age?: number;
  birthDate?: string;
  employerSchool?: string;
  occupationGrade?: string;
  cellPhone?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  
  // Account Holder Details
  responsibleForPayment?: string;
  accountHolderName?: string;
  accountHolderAge?: number;
  
  // Payment and Medical Aid
  paymentPreference?: string;
  medicalAidName?: string;
  medicalAidNo?: string;
  medicalAidPlan?: string;
  mainMember?: string;
  dependantCode?: string;
  
  // Medical History
  gpName?: string;
  gpContact?: string;
  allergies?: string;
  medication?: string;
  chronicConditions?: string[];
  
  // Emergency Contact
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  
  // Consent
  consentAgreement?: boolean;
  signature?: string;
  
  // Region and Practice Info
  region?: string;
  regionCode?: string;
  doctor?: string;
  practiceNumber?: string;
  
  // Metadata
  timestamp?: string;
  lastModified?: string;
  synced?: boolean;
  status?: string;
  submissionId?: string;
  autoSaved?: boolean;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  formId?: string | number;
}
