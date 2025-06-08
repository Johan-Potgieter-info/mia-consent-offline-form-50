
import { FormData } from '../../types/formTypes';

export const useFallbackStorage = () => {
  const saveToFallbackStorage = (formData: FormData): boolean => {
    try {
      const dataToStore = {
        ...formData,
        timestamp: new Date().toISOString(),
        fallbackStorage: true,
        status: 'draft'
      };
      localStorage.setItem('formDraftFallback', JSON.stringify(dataToStore));
      console.log('Saved to localStorage fallback as draft');
      return true;
    } catch (error) {
      console.error('Fallback storage failed:', error);
      try {
        sessionStorage.setItem('formDraftSession', JSON.stringify({
          ...formData,
          status: 'draft'
        }));
        console.log('Saved to sessionStorage as draft');
        return true;
      } catch (sessionError) {
        console.error('Session storage also failed:', sessionError);
        return false;
      }
    }
  };

  return { saveToFallbackStorage };
};
