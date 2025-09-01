'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dataAPI } from '@/lib/api';
import { School, SchoolFormData } from '@/types';

const schoolFormSchema = z.object({
  udise_code: z.string().min(1, 'UDISE code is required'),
  school_name: z.string().min(1, 'School name is required'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  block: z.string().min(1, 'Block is required'),
  village: z.string().min(1, 'Village is required'),
  management: z.string().min(1, 'Management type is required'),
  location: z.string().min(1, 'Location is required'),
  school_type: z.string().min(1, 'School type is required'),
  total_students: z.coerce.number().optional(),
  total_teachers: z.coerce.number().optional(),
});

type SchoolFormType = z.infer<typeof schoolFormSchema>;

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  school?: School | null;
  onSuccess: () => void;
}

export default function SchoolFormModal({ isOpen, onClose, school, onSuccess }: SchoolFormModalProps) {
  const isEditing = !!school;

  const form = useForm<SchoolFormType>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      udise_code: '',
      school_name: '',
      state: '',
      district: '',
      block: '',
      village: '',
      management: 'Government',
      location: 'Rural',
      school_type: 'Co-Ed',
      total_students: 0,
      total_teachers: 0,
    },
  });

  // Update form when school changes
  useEffect(() => {
    if (school) {
      form.reset({
        udise_code: school.udise_code,
        school_name: school.school_name,
        state: school.state,
        district: school.district,
        block: school.block,
        village: school.village,
        management: school.management,
        location: school.location,
        school_type: school.school_type,
        total_students: school.total_students || 0,
        total_teachers: school.total_teachers || 0,
      });
    } else {
      form.reset({
        udise_code: '',
        school_name: '',
        state: '',
        district: '',
        block: '',
        village: '',
        management: 'Government',
        location: 'Rural',
        school_type: 'Co-Ed',
        total_students: 0,
        total_teachers: 0,
      });
    }
  }, [school, form]);

  // Create school mutation
  const createMutation = useMutation({
    mutationFn: dataAPI.createSchool,
    onSuccess: () => {
      onSuccess();
    },
  });

  // Update school mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SchoolFormData> }) => 
      dataAPI.updateSchool(id, data),
    onSuccess: () => {
      onSuccess();
    },
  });

  const onSubmit = (data: SchoolFormType) => {
    if (isEditing && school) {
      updateMutation.mutate({ id: school._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit School' : 'Add New School'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                {(error as any)?.response?.data?.error || 'An error occurred'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UDISE Code */}
            <div className="space-y-2">
              <Label htmlFor="udise_code">UDISE Code *</Label>
              <Input
                id="udise_code"
                {...form.register('udise_code')}
                disabled={isEditing} // UDISE code shouldn't be editable
              />
              {form.formState.errors.udise_code && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.udise_code.message}
                </p>
              )}
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <Label htmlFor="school_name">School Name *</Label>
              <Input
                id="school_name"
                {...form.register('school_name')}
              />
              {form.formState.errors.school_name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.school_name.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...form.register('state')}
              />
              {form.formState.errors.state && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Input
                id="district"
                {...form.register('district')}
              />
              {form.formState.errors.district && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.district.message}
                </p>
              )}
            </div>

            {/* Block */}
            <div className="space-y-2">
              <Label htmlFor="block">Block *</Label>
              <Input
                id="block"
                {...form.register('block')}
              />
              {form.formState.errors.block && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.block.message}
                </p>
              )}
            </div>

            {/* Village */}
            <div className="space-y-2">
              <Label htmlFor="village">Village *</Label>
              <Input
                id="village"
                {...form.register('village')}
              />
              {form.formState.errors.village && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.village.message}
                </p>
              )}
            </div>

            {/* Management */}
            <div className="space-y-2">
              <Label>Management Type *</Label>
              <Select
                value={form.watch('management')}
                onValueChange={(value) => form.setValue('management', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private Unaided">Private Unaided</SelectItem>
                  <SelectItem value="Aided">Aided</SelectItem>
                  <SelectItem value="Central Government">Central Government</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.management && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.management.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <Select
                value={form.watch('location')}
                onValueChange={(value) => form.setValue('location', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rural">Rural</SelectItem>
                  <SelectItem value="Urban">Urban</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.location && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            {/* School Type */}
            <div className="space-y-2">
              <Label>School Type *</Label>
              <Select
                value={form.watch('school_type')}
                onValueChange={(value) => form.setValue('school_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Co-Ed">Co-Ed</SelectItem>
                  <SelectItem value="Girls">Girls</SelectItem>
                  <SelectItem value="Boys">Boys</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.school_type && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.school_type.message}
                </p>
              )}
            </div>

            {/* Total Students */}
            <div className="space-y-2">
              <Label htmlFor="total_students">Total Students</Label>
              <Input
                id="total_students"
                type="number"
                min="0"
                {...form.register('total_students')}
              />
            </div>

            {/* Total Teachers */}
            <div className="space-y-2">
              <Label htmlFor="total_teachers">Total Teachers</Label>
              <Input
                id="total_teachers"
                type="number"
                min="0"
                {...form.register('total_teachers')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update School' : 'Add School'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
