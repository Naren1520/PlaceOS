import React from 'react';
import { Progress } from './ui/progress';

interface MatchScoreBadgeProps {
  score: number;
  showProgress?: boolean;
}

export function MatchScoreBadge({ score, showProgress = false }: MatchScoreBadgeProps) {
  const getColor = () => {
    if (score >= 70) return { bg: '#22c55e', text: '#fff', light: '#dcfce7' };
    if (score >= 40) return { bg: '#eab308', text: '#fff', light: '#fef9c3' };
    return { bg: '#ef4444', text: '#fff', light: '#fee2e2' };
  };

  const colors = getColor();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ background: colors.bg, color: colors.text }}
        >
          {score}%
        </div>
        {score >= 70 && <span className="text-sm text-green-600">Excellent Match</span>}
        {score >= 40 && score < 70 && <span className="text-sm text-yellow-600">Good Match</span>}
        {score < 40 && <span className="text-sm text-red-600">Low Match</span>}
      </div>
      {showProgress && (
        <Progress value={score} className="h-2" />
      )}
    </div>
  );
}
