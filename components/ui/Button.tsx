import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'dense';
}

export function Button({ variant = 'primary', size = 'default', className = '', ...props }: ButtonProps) {
  let baseStyles = "inline-flex items-center justify-center rounded-[4px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  let sizeStyles = size === 'dense' ? "h-[28px] px-3 text-xs" : "h-[32px] px-4 text-sm";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-primary text-white hover:bg-primary-hover active:bg-primary-active";
      break;
    case 'secondary':
      variantStyles = "bg-surface text-primary-text border border-border-contrast hover:bg-canvas-secondary";
      break;
    case 'ghost':
      variantStyles = "bg-transparent text-secondary-text hover:bg-border-default";
      break;
    case 'destructive':
      variantStyles = "bg-status-fail-bg text-status-fail-fg border border-status-fail-border hover:bg-[#FEE4E2]";
      break;
  }

  return (
    <button className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props} />
  );
}
