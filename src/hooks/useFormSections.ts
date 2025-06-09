
import { useMemo } from 'react';
import PatientDetailsSection from '../components/PatientDetailsSection';
import AccountHolderSection from '../components/AccountHolderSection';
import PaymentEmergencySection from '../components/PaymentEmergencySection';
import MedicalHistorySection from '../components/MedicalHistorySection';
import ConsentSection from '../components/ConsentSection';

export const useFormSections = () => {
  const sections = useMemo(() => [
    { id: 'patientDetails', title: '1. Patient Details', component: PatientDetailsSection },
    { id: 'accountHolder', title: '2. Account Holder Details', component: AccountHolderSection },
    { id: 'paymentEmergency', title: '3. Payment and Emergency Contact', component: PaymentEmergencySection },
    { id: 'medicalHistory', title: '4. Medical History', component: MedicalHistorySection },
    { id: 'consent', title: '5. Consent', component: ConsentSection },
  ], []);

  return { sections };
};
