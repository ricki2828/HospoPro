import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  children?: ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  change,
  children,
  className = '',
}: DashboardCardProps) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        {value !== undefined && (
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <p
                className={`ml-2 text-sm font-medium ${
                  change.type === 'increase'
                    ? 'text-success-700'
                    : 'text-error-700'
                }`}
              >
                {change.type === 'increase' ? '+' : '-'}
                {Math.abs(change.value)}%
              </p>
            )}
          </div>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}