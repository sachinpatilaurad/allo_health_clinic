// frontend/src/components/dashboard/AppointmentFormModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Appointment, Doctor } from '@/types';
import api from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: Partial<Appointment>) => void;
  appointmentToEdit: Appointment | null;
}

export default function AppointmentFormModal({ isOpen, onClose, onSave, appointmentToEdit }: AppointmentFormModalProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!appointmentToEdit;

  // Fetch doctors when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        try {
          const response = await api.get('/doctors');
          setDoctors(response.data);
        } catch (err) {
          setError("Could not load doctor list.");
        }
      };
      fetchDoctors();
    }
  }, [isOpen]);

  // Populate form when appointmentToEdit changes
  useEffect(() => {
    if (isEditing && appointmentToEdit) {
      setFormData({
        ...appointmentToEdit,
        // The HTML datetime-local input needs this specific format
        appointmentTime: new Date(appointmentToEdit.appointmentTime).toISOString().slice(0, 16),
        // We need to store the doctor's ID for the select input
        doctor: { id: appointmentToEdit.doctor.id } as Doctor,
      });
    } else {
      setFormData({
        patientName: '',
        appointmentTime: '',
        doctor: undefined,
      });
    }
  }, [appointmentToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'doctorId') {
      setFormData(prev => ({ ...prev, doctor: { id: parseInt(value) } as Doctor }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError("Failed to save appointment. Please check the details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Reschedule Appointment' : 'Book New Appointment'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input type="text" name="patientName" id="patientName" value={formData.patientName || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input type="datetime-local" name="appointmentTime" id="appointmentTime" value={formData.appointmentTime || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Doctor</label>
            <select name="doctorId" id="doctorId" value={formData.doctor?.id || ''} onChange={handleChange} required className="input">
              <option value="">Select a doctor</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end pt-2 space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? 'Saving...' : 'Save Appointment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}