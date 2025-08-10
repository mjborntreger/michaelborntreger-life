'use client';

import { useState } from 'react';

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
    <button onClick={() => setShow(true)} className="btn-primary ring-focus">
      Reveal Email
    </button>
  );
}
