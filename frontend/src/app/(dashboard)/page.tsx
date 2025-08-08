// frontend/src/app/(dashboard)/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { QueuePatient, Doctor, QueueStatus } from '@/types';
import { CheckCircleIcon, XCircleIcon, PlusIcon, FireIcon } from '@heroicons/react/24/solid';
import AddPatientModal from '@/components/dashboard/AddPatientModal';
import StatusDropdown from '@/components/ui/StatusDropdown'; // We need this now

// Define the shape of the form data for clarity
interface NewPatientFormData {
  patientName: string;
  contactNumber: string;
  reasonForVisit: string;
  isUrgent: boolean;
  assignedDoctorId: string;
}

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingPatientId, setUpdatingPatientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [queueResponse, doctorsResponse] = await Promise.all([
          api.get('/queue'),
          api.get('/doctors'),
        ]);
        const sortedQueue = queueResponse.data.sort((a: QueuePatient, b: QueuePatient) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
        setQueue(sortedQueue);
        setDoctors(doctorsResponse.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddPatient = async (formData: NewPatientFormData) => {
    try {
      const payload = {
        ...formData,
        assignedDoctorId: formData.assignedDoctorId ? parseInt(formData.assignedDoctorId, 10) : undefined,
      };
      const response = await api.post('/queue', payload);
      const newPatient = response.data;
      setQueue(currentQueue => {
        const newQueue = [...currentQueue, newPatient];
        newQueue.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
        return newQueue;
      });
    } catch (err) {
      console.error("Failed to add patient:", err);
      throw err;
    }
  };

  const handleStatusChange = async (patientId: number, newStatus: QueueStatus) => {
    setUpdatingPatientId(patientId);
    try {
      await api.patch(`/queue/${patientId}/status`, { status: newStatus });
      setQueue(currentQueue => 
        currentQueue.map(p => 
          p.id === patientId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingPatientId(null);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {/* FIX 3: Replaced ' with &apos; */}
          <p className="mt-1 text-gray-600">Welcome back, here&apos;s your clinic overview.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Patient Queue</h2>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Patient
              </button>
            </div>
            <div className="space-y-4">
              {queue.length > 0 ? queue.map((patient, index) => (
                <div key={patient.id} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${patient.isUrgent ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 mr-4 font-bold text-gray-600 bg-gray-200 rounded-full">{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-800 flex items-center">
                        {patient.patientName}
                        {patient.isUrgent && <FireIcon className="w-5 h-5 ml-2 text-red-600" title="Urgent" />}
                      </p>
                      <p className="text-sm text-gray-500">
                        Arrival: {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <StatusDropdown
                    currentStatus={patient.status}
                    isLoading={updatingPatientId === patient.id}
                    onStatusChange={(newStatus) => handleStatusChange(patient.id, newStatus)}
                  />
                </div>
              )) : (
                <div className="text-center py-8"><p className="text-gray-500">The queue is currently empty.</p></div>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Doctors on Duty</h2>
            <div className="space-y-4">
              {doctors.map(doctor => (
                <div key={doctor.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${doctor.isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
                    {doctor.isAvailable ? <CheckCircleIcon className="w-6 h-6 text-green-600" /> : <XCircleIcon className="w-6 h-6 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPatientAdded={handleAddPatient} />
    </>
  );
}