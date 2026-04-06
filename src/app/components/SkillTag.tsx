import React from 'react';

interface SkillTagProps {
  skill: string;
  matched?: boolean;
}

export function SkillTag({ skill, matched }: SkillTagProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-lg text-sm transition-all hover:scale-105"
      style={{
        background: matched ? 'rgba(34, 197, 94, 0.1)' : 'rgba(179, 92, 0, 0.1)',
        color: matched ? '#22c55e' : '#b35c00',
        border: `1px solid ${matched ? 'rgba(34, 197, 94, 0.3)' : 'rgba(179, 92, 0, 0.3)'}`,
      }}
    >
      {skill}
    </span>
  );
}
