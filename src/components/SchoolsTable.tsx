'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { dataAPI } from '@/lib/api';
import { School, HierarchicalFilters } from '@/types';
import SchoolFormModal from './SchoolFormModal';
import SchoolDetailsModal from './SchoolDetailsModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface SchoolsTableProps {
  filters: HierarchicalFilters;
}

export default function SchoolsTable({ filters }: SchoolsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const queryClient = useQueryClient();

  // Fetch schools
  const { data, isLoading, error } = useQuery({
    queryKey: ['schools', filters, currentPage, pageSize],
    queryFn: () => dataAPI.getSchools({ ...filters, page: currentPage, limit: pageSize }),
    keepPreviousData: true,
  });

  // Delete school mutation
  const deleteSchoolMutation = useMutation({
    mutationFn: dataAPI.deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      setIsDeleteModalOpen(false);
      setSelectedSchool(null);
    },
  });

  const handleRowClick = (school: School) => {
    setSelectedSchool(school);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (school: School, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSchool(school);
    setIsFormModalOpen(true);
  };

  const handleDelete = (school: School, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSchool(school);
    setIsDeleteModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSchool(null);
    setIsFormModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading schools: {(error as any)?.response?.data?.error || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Schools</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New School
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading schools...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>UDISE Code</TableHead>
                  <TableHead>Management</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>School Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((school) => (
                  <TableRow
                    key={school._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(school)}
                  >
                    <TableCell className="font-medium">{school.school_name}</TableCell>
                    <TableCell>{school.udise_code}</TableCell>
                    <TableCell>{school.management}</TableCell>
                    <TableCell>{school.location}</TableCell>
                    <TableCell>{school.school_type}</TableCell>
                    <TableCell>{school.state}</TableCell>
                    <TableCell>{school.district}</TableCell>
                    <TableCell>{school.block}</TableCell>
                    <TableCell>{school.village}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleRowClick(school)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEdit(school, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDelete(school, e)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data?.pagination && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Showing {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalRecords)} of{' '}
                    {data.pagination.totalRecords} results
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!data.pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    
                    <span className="px-3 py-1 text-sm">
                      Page {data.pagination.currentPage} of {data.pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!data.pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <SchoolFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        school={editingSchool}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['schools'] });
          setIsFormModalOpen(false);
          setEditingSchool(null);
        }}
      />

      <SchoolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        school={selectedSchool}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedSchool && deleteSchoolMutation.mutate(selectedSchool._id)}
        isLoading={deleteSchoolMutation.isPending}
        itemName={selectedSchool?.school_name || ''}
      />
    </div>
  );
}