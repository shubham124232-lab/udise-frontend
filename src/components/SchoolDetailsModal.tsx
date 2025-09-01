'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { School } from '@/types';

interface SchoolDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
}

export default function SchoolDetailsModal({ isOpen, onClose, school }: SchoolDetailsModalProps) {
  if (!school) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>School Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">UDISE Code</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.udise_code}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">School Name</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.school_name}</p>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.state}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">District</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.district}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Block</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.block}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Village</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.village}</p>
              </div>
            </div>
          </div>

          {/* School Classification */}
          <div>
            <h3 className="text-lg font-semibold mb-3">School Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Management</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.management}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.location}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">School Type</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.school_type}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {(school.total_students || school.total_teachers) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {school.total_students !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Total Students</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.total_students}</p>
                  </div>
                )}
                
                {school.total_teachers !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Total Teachers</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{school.total_teachers}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Created At</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {formatDate(school.createdAt)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {formatDate(school.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
