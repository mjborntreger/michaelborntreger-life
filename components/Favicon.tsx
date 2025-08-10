'use client';

type Props = {
  url: string;
  className?: string;
  size?: number; // px
};

/** Renders site favicon from `${origin}/favicon.ico`. Hides itself on error. */
export default function Favicon({ url, className = '', size = 16 }: Props) {
  let origin = '';
  try {
    origin = new URL(url).origin;
  } catch {
    // invalid URL
  }
  if (!origin) return null;

  return (
    <img
      src={`${origin}/favicon.ico`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={`inline-block ${className}`}
      onError={(e) => {
        // Hide broken icons quietly
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
