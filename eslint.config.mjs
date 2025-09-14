// Flat ESLint config for Next.js 15 + ESLint 9
// Docs: https://nextjs.org/docs/app/building-your-application/configuring/eslint

import next from 'eslint-config-next';

export default [
  // Ignore build artifacts and deps
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      // Ignore nested example app with incompatible deps
      'michaelborntreger-life/**',
    ],
  },

  // Next.js recommended rules (flat config)
  ...next,
];
