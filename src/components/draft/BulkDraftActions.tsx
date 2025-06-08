
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface BulkDraftActionsProps {
  totalDrafts: number;
  selectedCount: number;
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onBulkDelete: () => void;
  isBulkDeleting: boolean;
  onClearSelection: () => void;
}

const BulkDraftActions = ({
  totalDrafts,
  selectedCount,
  isSelectAll,
  onToggleSelectAll,
  onBulkDelete,
  isBulkDeleting,
  onClearSelection
}: BulkDraftActionsProps) => {
  if (totalDrafts === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="select-all"
          checked={isSelectAll || selectedCount === totalDrafts}
          onCheckedChange={onToggleSelectAll}
          className="h-4 w-4"
        />
        <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
          Select All ({totalDrafts})
        </label>
        {selectedCount > 0 && (
          <span className="text-sm text-gray-500">
            {selectedCount} selected
          </span>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            disabled={isBulkDeleting}
          >
            Clear Selection
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isBulkDeleting}
                className="flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete {selectedCount} Selected</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Drafts</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedCount} selected draft{selectedCount !== 1 ? 's' : ''}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default BulkDraftActions;
