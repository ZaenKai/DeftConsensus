type IconProps = {
  className?: string;
};

export function LogoMarkIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 17.5L12 6.5L18 17.5H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 13.5H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GridIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function RouteIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 6H14C16.2 6 18 7.8 18 10V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 16C6 13.8 7.8 12 10 12H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="9.2" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 18.5C4.1 15.9 6.3 14 9 14H10.6C13.3 14 15.5 15.9 16.1 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.2 14.7C16.1 15 17.7 16.3 18.3 18.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SparkIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5L13.8 8.2L18.5 10L13.8 11.8L12 16.5L10.2 11.8L5.5 10L10.2 8.2L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18.5 15L19.4 17.1L21.5 18L19.4 18.9L18.5 21L17.6 18.9L15.5 18L17.6 17.1L18.5 15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 20H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="5.2" y="11.5" width="3.4" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="10.3" y="8.5" width="3.4" height="9.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="15.4" y="5.5" width="3.4" height="12.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function MessageIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 5.5H18C19.4 5.5 20.5 6.6 20.5 8V14C20.5 15.4 19.4 16.5 18 16.5H11L7 19V16.5H6C4.6 16.5 3.5 15.4 3.5 14V8C3.5 6.6 4.6 5.5 6 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.8L18.5 6.4V12.1C18.5 15.9 16 19.3 12 20.7C8 19.3 5.5 15.9 5.5 12.1V6.4L12 3.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.2 12.1L11.2 14.1L14.8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
