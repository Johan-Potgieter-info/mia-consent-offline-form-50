
import { Region } from '../utils/regionDetection';

export interface FormData {
  [key: string]: any;
  id?: number;
  responsibleForPayment?: string;
  paymentPreference?: string;
  region?: string;
  regionCode?: string;
  doctor?: string;
  practiceNumber?: string;
  patientName?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  formId?: number;
}
