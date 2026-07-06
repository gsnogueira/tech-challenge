import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export function Button({ children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props }: ButtonProps) {
  const classes = ['ui-btn', `ui-btn--${variant}`, size !== 'md' ? `ui-btn--${size}` : '', fullWidth ? 'ui-btn--full' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
