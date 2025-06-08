
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useBulkDraftOperations = () => {
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  const { toast } = useToast();

  const toggleDraftSelection = (draftId: string) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(draftId)) {
      newSelected.delete(draftId);
    } else {
      newSelected.add(draftId);
    }
    setSelectedDrafts(newSelected);
    setIsSelectAll(false);
  };

  const toggleSelectAll = (allDraftIds: string[]) => {
    if (isSelectAll || selectedDrafts.size === allDraftIds.length) {
      // Deselect all
      setSelectedDrafts(new Set());
      setIsSelectAll(false);
    } else {
      // Select all
      setSelectedDrafts(new Set(allDraftIds));
      setIsSelectAll(true);
    }
  };

  const clearSelection = () => {
    setSelectedDrafts(new Set());
    setIsSelectAll(false);
  };

  const getSelectedCount = () => selectedDrafts.size;

  const getSelectedDrafts = () => Array.from(selectedDrafts);

  return {
    selectedDrafts,
    isSelectAll,
    toggleDraftSelection,
    toggleSelectAll,
    clearSelection,
    getSelectedCount,
    getSelectedDrafts
  };
};
