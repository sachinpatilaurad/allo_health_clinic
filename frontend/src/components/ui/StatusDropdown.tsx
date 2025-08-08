// frontend/src/components/ui/StatusDropdown.tsx

"use client";

import { QueueStatus } from "@/types";

interface StatusDropdownProps {
  currentStatus: QueueStatus;
  onStatusChange: (newStatus: QueueStatus) => void;
  isLoading: boolean;
}

export default function StatusDropdown({ currentStatus, onStatusChange, isLoading }: StatusDropdownProps) {
  
  const statusOptions = [
    QueueStatus.WAITING,
    QueueStatus.WITH_DOCTOR,
    QueueStatus.COMPLETED,
  ];

  const statusStyles: Record<QueueStatus, string> = {
    [QueueStatus.WAITING]: 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500',
    [QueueStatus.WITH_DOCTOR]: 'bg-blue-100 text-blue-800 focus:ring-blue-500',
    [QueueStatus.COMPLETED]: 'bg-green-100 text-green-800 focus:ring-green-500',
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as QueueStatus;
    onStatusChange(newStatus);
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isLoading}
      className={`pl-3 pr-8 py-1 text-xs font-medium border border-transparent rounded-full appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusStyles[currentStatus]}`}
    >
      {statusOptions.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}