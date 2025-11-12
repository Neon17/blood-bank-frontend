import React from 'react';

// Status badge component
export const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    approved: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      dot: 'bg-green-500',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500',
      label: 'Rejected',
    },
    wrong: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500',
      label: 'Wrong',
    },
    pending: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
      dot: 'bg-yellow-500',
      label: 'Pending',
    },
  };

  const config =
    statusConfig[status.toLowerCase() as keyof typeof statusConfig] ||
    statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

// Action button component
export const ActionButton = ({
  onClick,
  icon,
  title,
  color = 'gray',
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  color?: 'blue' | 'green' | 'red' | 'gray';
}) => {
  const colorClasses = {
    blue: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
    green:
      'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
    red: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
    gray: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300',
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${colorClasses[color]}`}
      title={title}
    >
      {icon}
    </button>
  );
};
