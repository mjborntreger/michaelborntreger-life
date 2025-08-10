import Link from 'next/link';
import RevealEmail from '@/components/RevealEmail';

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Contact</h1>
        <p className="muted">Get in touch using the button below.</p>
      </header>
      <div className="card p-6 max-w-md">
        <RevealEmail email="mike.borntreger@gmail.com" />
      </div>
    </div>
  );
}
