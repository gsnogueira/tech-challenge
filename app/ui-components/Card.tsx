import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  accent?: 'green' | 'red' | 'blue' | 'purple';
  className?: string;
};

export function Card({ title, subtitle, children, footer, accent = 'green', className = '' }: CardProps) {
  return (
    <section className={`ui-card ui-card--accent-${accent} ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="ui-card__header">
          {title && <h3 className="ui-card__title">{title}</h3>}
          {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </section>
  );
}
