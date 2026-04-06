import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = '#b35c00' }: StatsCardProps) {
  return (
    <div 
      className="rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(179, 92, 0, 0.08)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-70 mb-2">{title}</p>
          <h3 className="text-3xl font-bold" style={{ color }}>{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-xl"
          style={{ background: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
