
// Supabase operations for form data

import { supabase } from '../integrations/supabase/client';
import { FormData } from '../types/formTypes';

/**
 * Save form data to Supabase
 * @param formData Form data to save
 * @param isDraft Whether this is a draft or completed form
 * @returns Promise with saved form data
 */
export const saveFormToSupabase = async (formData: FormData, isDraft: boolean = false): Promise<any> => {
  try {
    const tableName = isDraft ? 'form_drafts' : 'consent_forms';
    const timestamp = new Date().toISOString();
    
    const dataToSave = {
      ...formData,
      timestamp,
      last_modified: timestamp,
      encrypted: false, // Data is already encrypted at transport level with Supabase
      status: isDraft ? 'draft' : 'completed',
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert([dataToSave])
      .select()
      .single();

    if (error) {
      console.error(`Supabase ${tableName} save error:`, error);
      throw error;
    }

    console.log(`Form saved to Supabase ${tableName}:`, data.id);
    return data;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
};

/**
 * Update existing form data in Supabase
 * @param id Form ID
 * @param formData Updated form data
 * @param isDraft Whether this is a draft or completed form
 * @returns Promise with updated form data
 */
export const updateFormInSupabase = async (id: string, formData: FormData, isDraft: boolean = false): Promise<any> => {
  try {
    const tableName = isDraft ? 'form_drafts' : 'consent_forms';
    const timestamp = new Date().toISOString();
    
    const dataToUpdate = {
      ...formData,
      last_modified: timestamp,
    };

    const { data, error } = await supabase
      .from(tableName)
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Supabase ${tableName} update error:`, error);
      throw error;
    }

    console.log(`Form updated in Supabase ${tableName}:`, data.id);
    return data;
  } catch (error) {
    console.error('Error updating in Supabase:', error);
    throw error;
  }
};

/**
 * Get all forms from Supabase
 * @param isDraft Whether to get drafts or completed forms
 * @returns Promise with forms array
 */
export const getFormsFromSupabase = async (isDraft: boolean = false): Promise<any[]> => {
  try {
    const tableName = isDraft ? 'form_drafts' : 'consent_forms';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('last_modified', { ascending: false });

    if (error) {
      console.error(`Supabase ${tableName} fetch error:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    throw error;
  }
};

/**
 * Delete form from Supabase
 * @param id Form ID
 * @param isDraft Whether this is a draft or completed form
 * @returns Promise that resolves when deleted
 */
export const deleteFormFromSupabase = async (id: string, isDraft: boolean = false): Promise<void> => {
  try {
    const tableName = isDraft ? 'form_drafts' : 'consent_forms';
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Supabase ${tableName} delete error:`, error);
      throw error;
    }

    console.log(`Form deleted from Supabase ${tableName}:`, id);
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    throw error;
  }
};

/**
 * Get forms by region from Supabase
 * @param regionCode Region code to filter by
 * @param isDraft Whether to get drafts or completed forms
 * @returns Promise with filtered forms
 */
export const getFormsByRegionFromSupabase = async (regionCode: string, isDraft: boolean = false): Promise<any[]> => {
  try {
    const tableName = isDraft ? 'form_drafts' : 'consent_forms';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('region_code', regionCode)
      .order('last_modified', { ascending: false });

    if (error) {
      console.error(`Supabase ${tableName} fetch by region error:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching by region from Supabase:', error);
    throw error;
  }
};

/**
 * Test Supabase connection
 * @returns Promise<boolean> True if connection is successful
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('consent_forms')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};
