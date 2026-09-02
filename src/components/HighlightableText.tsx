import React from 'react';
import { HighlightItem } from '../types';

interface HighlightableTextProps {
  text: string;
  questionId?: number;
  paragraphId?: number;
  highlights: HighlightItem[];
  onRemoveHighlight: (id: string) => void;
  className?: string;
  as?: React.ElementType;
}

export const HighlightableText: React.FC<HighlightableTextProps> = ({
  text,
  questionId,
  paragraphId,
  highlights,
  onRemoveHighlight,
  className = '',
  as: Component = 'span',
}) => {
  // Filter highlights matching this specific container
  const relevantHighlights = highlights.filter((h) => {
    if (questionId !== undefined && h.questionId === questionId) return true;
    if (paragraphId !== undefined && h.paragraphId === paragraphId) return true;
    return false;
  });

  if (relevantHighlights.length === 0) {
    return <Component className={className}>{text}</Component>;
  }

  // Segment the text according to matching highlights
  let segments: { text: string; highlight?: HighlightItem }[] = [{ text }];

  for (const hl of relevantHighlights) {
    if (!hl.text || hl.text.trim().length === 0) continue;
    const nextSegments: typeof segments = [];

    for (const seg of segments) {
      if (seg.highlight) {
        nextSegments.push(seg);
        continue;
      }

      const idx = seg.text.toLowerCase().indexOf(hl.text.toLowerCase());
      if (idx === -1) {
        nextSegments.push(seg);
      } else {
        const before = seg.text.substring(0, idx);
        const matched = seg.text.substring(idx, idx + hl.text.length);
        const after = seg.text.substring(idx + hl.text.length);

        if (before) nextSegments.push({ text: before });
        nextSegments.push({ text: matched, highlight: hl });
        if (after) nextSegments.push({ text: after });
      }
    }
    segments = nextSegments;
  }

  return (
    <Component className={className}>
      {segments.map((seg, idx) => {
        if (seg.highlight) {
          const colorClass =
            seg.highlight.color === 'yellow'
              ? 'bg-amber-200/90 text-slate-900'
              : seg.highlight.color === 'green'
              ? 'bg-emerald-200/90 text-slate-900'
              : seg.highlight.color === 'cyan'
              ? 'bg-sky-200/90 text-slate-900'
              : 'bg-pink-200/90 text-slate-900';

          return (
            <span
              key={idx}
              className={`${colorClass} px-0.5 py-0.5 rounded cursor-pointer transition-all hover:ring-1 hover:ring-slate-400 select-text`}
              title="Click to remove highlight"
              onClick={(e) => {
                e.stopPropagation();
                if (seg.highlight) onRemoveHighlight(seg.highlight.id);
              }}
            >
              {seg.text}
            </span>
          );
        }

        return <span key={idx}>{seg.text}</span>;
      })}
    </Component>
  );
};
