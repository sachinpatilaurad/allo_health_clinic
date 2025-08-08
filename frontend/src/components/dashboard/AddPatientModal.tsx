// frontend/src/components/dashboard/AddPatientModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Doctor } from '@/types'; // Import our Doctor type
import api from '@/lib/api';

// Define the shape of the form data
interface FormData {
  patientName: string;
  contactNumber: string;
  reasonForVisit: string;
  isUrgent: boolean;
  assignedDoctorId: string; // Use string for select element value
}

// Define the component's props
interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: (formData: FormData) => void;
}

const initialFormState: FormData = {
  patientName: '',
  contactNumber: '',
  reasonForVisit: '',
  isUrgent: false,
  assignedDoctorId: '',
};

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }: AddPatientModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch doctors when the modal opens ---
  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        try {
          const response = await api.get('/doctors');
          setDoctors(response.data);
        } catch (err) {
          console.error("Failed to fetch doctors:", err);
          setError("Could not load doctor list.");
        }
      };
      fetchDoctors();
    }
  }, [isOpen]); // Re-run this effect whenever 'isOpen' changes

  // --- Universal input handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately because its value is in 'checked'
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.patientName.trim()) {
      setError("Patient name cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onPatientAdded(formData);
      handleClose();
    } catch (err) {
      setError("Failed to add patient. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    setFormData(initialFormState); // Reset form state when closing
    setError(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl transform transition-all">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add New Patient to Queue</h3>
          <button onClick={handleClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Full Name <span className="text-red-500">*</span></label>
            <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} required className="mt-1 block w-full input" placeholder="e.g., John Doe" />
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="mt-1 block w-full input" placeholder="e.g., 555-123-4567" />
          </div>
          
          {/* Reason for Visit */}
          <div>
            <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
            <textarea id="reasonForVisit" name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} rows={3} className="mt-1 block w-full input" placeholder="e.g., Annual check-up, flu symptoms..."></textarea>
          </div>
          
          {/* Assigned Doctor */}
          <div>
            <label htmlFor="assignedDoctorId" className="block text-sm font-medium text-gray-700">Assign to Doctor (Optional)</label>
            <select id="assignedDoctorId" name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleChange} className="mt-1 block w-full input">
              <option value="">Select a doctor...</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
              ))}
            </select>
          </div>
          
          {/* Is Urgent Checkbox */}
          <div className="flex items-center">
            <input id="isUrgent" name="isUrgent" type="checkbox" checked={formData.isUrgent} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">Mark as Urgent</label>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end pt-2 space-x-2">
            <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? 'Adding...' : 'Add to Queue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}