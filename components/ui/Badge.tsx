import React from 'react';

type BadgeType = 'SOURCE_VALUE' | 'DFT_CALCULATED' | 'AI_INTERPRETATION' | 'UNAVAILABLE' | 'FAILED' | 'PASS' | 'WARN' | 'INFO';

export function Badge({ type, children }: { type: BadgeType, children?: React.ReactNode }) {
  let styles = "inline-flex items-center font-mono text-[10px] uppercase px-[6px] py-[2px] rounded-[4px] border border-solid whitespace-nowrap";
  
  switch(type) {
    case 'SOURCE_VALUE':
      styles += " bg-canvas-secondary border-border-contrast text-secondary-text";
      break;
    case 'DFT_CALCULATED':
    case 'INFO':
      styles += " bg-status-info-bg border-status-info-border text-status-info-fg";
      break;
    case 'AI_INTERPRETATION':
    case 'WARN':
      styles += " bg-status-warn-bg border-status-warn-border text-status-warn-fg";
      break;
    case 'UNAVAILABLE':
    case 'FAILED':
      styles += " bg-status-fail-bg border-status-fail-border text-status-fail-fg";
      break;
    case 'PASS':
      styles += " bg-status-pass-bg border-status-pass-border text-status-pass-fg";
      break;
  }

  return (
    <span className={styles}>
      {children || type}
    </span>
  );
}
