// frontend/src/components/dashboard/DoctorFormModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Doctor } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctorData: Partial<Doctor>) => void;
  doctorToEdit: Doctor | null;
}

export default function DoctorFormModal({ isOpen, onClose, onSave, doctorToEdit }: DoctorFormModalProps) {
  const [formData, setFormData] = useState<Partial<Doctor>>({});
  const [isLoading, setIsLoading] = useState(false);

  // When the modal opens, populate the form if we are editing
  useEffect(() => {
    if (doctorToEdit) {
      setFormData(doctorToEdit);
    } else {
      // Reset to default values for a new doctor
      setFormData({
        name: '',
        specialization: '',
        location: '',
        gender: '',
        isAvailable: true,
      });
    }
  }, [doctorToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const isEditing = !!doctorToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Doctor Profile' : 'Add New Doctor'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
            <input type="text" name="specialization" id="specialization" value={formData.specialization || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" id="gender" value={formData.gender || ''} onChange={handleChange} required className="input">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isAvailable" id="isAvailable" checked={formData.isAvailable || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">Is Available</label>
          </div>
          <div className="flex justify-end pt-2 space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}