type FormattedDateProps = {
  date: string | number | Date; // accepts ISO, timestamp, or Date
  className?: string;
  format?: Intl.DateTimeFormatOptions;
};

export default function FormattedDate({
  date,
  className = '',
  format = { month: 'short', day: '2-digit', year: 'numeric' },
}: FormattedDateProps) {
  const d = date instanceof Date ? date : new Date(date);
  const label = d.toLocaleDateString(undefined, format);

  return (
    <time
      dateTime={d.toISOString()}
      className={`muted text-sm ${className}`}
    >
      {label}
    </time>
  );
}
