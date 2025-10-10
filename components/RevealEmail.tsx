'use client';

import { useState } from 'react';
import { Button } from '@/components/components/ui/button';

export default function RevealEmail({ email }: { email: string }) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <a href={`mailto:${email}`} className="link text-lg font-medium break-all">
        {email}
      </a>
    );
  }

  return (
    <Button type="button" onClick={() => setShow(true)}>
      Reveal Email
    </Button>
  );
}
