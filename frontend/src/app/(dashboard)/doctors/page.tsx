// frontend/src/app/(dashboard)/doctors/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Doctor } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DoctorFormModal from '@/components/dashboard/DoctorFormModal';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Could not load doctor data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenAddModal = () => {
    setDoctorToEdit(null); // Ensure we're not editing
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setDoctorToEdit(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDoctorToEdit(null);
  };

  const handleSaveDoctor = async (doctorData: Partial<Doctor>) => {
    try {
      if (doctorToEdit) {
        // Update existing doctor
        await api.patch(`/doctors/${doctorToEdit.id}`, doctorData);
      } else {
        // Create new doctor
        await api.post('/doctors', doctorData);
      }
      handleCloseModal();
      fetchDoctors(); // Refresh the list
    } catch (err) {
      console.error("Failed to save doctor:", err);
      // Here you could set an error state to display in the modal
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    if (window.confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) {
      try {
        await api.delete(`/doctors/${doctorId}`);
        fetchDoctors(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete doctor:", err);
        alert("Failed to delete doctor.");
      }
    }
  };


  if (isLoading) return <div className="p-8">Loading doctors...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Doctors</h1>
            <p className="mt-1 text-gray-600">Add, edit, or remove doctor profiles.</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Doctor
          </button>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{doctor.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{doctor.specialization}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{doctor.location}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {doctor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleOpenEditModal(doctor)} className="text-indigo-600 hover:text-indigo-900 p-1"><PencilIcon className="w-5 h-5" /></button>
                      <button onClick={() => handleDeleteDoctor(doctor.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DoctorFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDoctor}
        doctorToEdit={doctorToEdit}
      />
    </>
  );
}