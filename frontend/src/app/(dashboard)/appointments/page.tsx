// frontend/src/app/(dashboard)/appointments/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Appointment } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AppointmentFormModal from '@/components/dashboard/AppointmentFormModal';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments');
      const sortedAppointments = response.data.sort((a: Appointment, b: Appointment) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime());
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Could not load appointment data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenAddModal = () => {
    setAppointmentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAppointmentToEdit(null);
  };

  const handleSaveAppointment = async (appointmentData: Partial<Appointment>) => {
    // The backend expects the doctor's ID in a specific field
    const payload = {
      patientName: appointmentData.patientName,
      appointmentTime: new Date(appointmentData.appointmentTime!).toISOString(),
      doctorId: appointmentData.doctor!.id,
    };

    try {
      if (appointmentToEdit) {
        // We only allow rescheduling time, not status, from this modal
        await api.patch(`/appointments/${appointmentToEdit.id}`, { appointmentTime: payload.appointmentTime });
      } else {
        await api.post('/appointments', payload);
      }
      handleCloseModal();
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Failed to save appointment:", err);
      throw err; // Re-throw to show error in modal
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error("Failed to cancel appointment:", err);
        alert("Failed to cancel appointment.");
      }
    }
  };

  if (isLoading) return <div className="p-8">Loading appointments...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Appointments</h1>
            <p className="mt-1 text-gray-600">Book, reschedule, or cancel appointments.</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Book New Appointment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{appt.patientName}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{appt.doctor.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{formatDate(appt.appointmentTime)}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'booked' ? 'bg-blue-100 text-blue-800' : appt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleOpenEditModal(appt)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Reschedule"><PencilIcon className="w-5 h-5" /></button>
                      <button onClick={() => handleCancelAppointment(appt.id)} className="text-red-600 hover:text-red-900 p-1" title="Cancel Appointment"><TrashIcon className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        appointmentToEdit={appointmentToEdit}
      />
    </>
  );
}