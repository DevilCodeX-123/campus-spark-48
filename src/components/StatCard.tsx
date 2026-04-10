import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'teal' | 'red' | 'blue' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color = 'teal' }) => {
  const colorMap = {
    teal: 'bg-primary/10 text-primary',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="stat-card flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-3xl font-bold text-foreground">{value}</p>
        {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
      </div>
      <div className={`rounded-lg p-3 ${colorMap[color as keyof typeof colorMap]}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
