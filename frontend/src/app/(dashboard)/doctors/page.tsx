

"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { Doctor } from "@/types";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DoctorFormModal from "@/components/dashboard/DoctorFormModal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/doctors");
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

  // Extract unique specializations for filter dropdown
  const specializations = useMemo(() => {
    const specs = doctors.map((d) => d.specialization).filter(Boolean);
    return Array.from(new Set(specs));
  }, [doctors]);

  // Filtered & searched doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
        doc.location.toLowerCase().includes(search.toLowerCase());

      const matchesSpecialization = specializationFilter
        ? doc.specialization === specializationFilter
        : true;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, search, specializationFilter]);

  const handleOpenAddModal = () => {
    setDoctorToEdit(null);
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
        await api.patch(`/doctors/${doctorToEdit.id}`, doctorData);
      } else {
        await api.post("/doctors", doctorData);
      }
      handleCloseModal();
      fetchDoctors();
    } catch (err) {
      console.error("Failed to save doctor:", err);
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/doctors/${doctorId}`);
        fetchDoctors();
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Doctors</h1>
            <p className="mt-1 text-gray-600">
              Add, edit, search, or remove doctor profiles.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Doctor
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, specialization, or location..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {doctor.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {doctor.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doctor.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(doctor)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No doctors found.
                    </td>
                  </tr>
                )}
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
