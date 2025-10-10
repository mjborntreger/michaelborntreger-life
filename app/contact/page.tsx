import Link from 'next/link';
import RevealEmail from '@/components/RevealEmail';
import { Card } from '@/components/components/ui/card';
import { TypographyH1, TypographyLead } from '@/components/components/ui/typography';

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Contact</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">
          Get in touch using the button below.
        </TypographyLead>
      </header>
      <Card className="max-w-md p-6">
        <RevealEmail email="mike.borntreger@gmail.com" />
      </Card>
    </div>
  );
}
