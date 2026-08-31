import type { ReactNode } from 'react';

export interface EmailProvider {
  name: string;
  url: string;
  color: string;
  bgColor: string;
  icon: ReactNode;
}

export const DOMAIN_MAP: Record<string, string> = {
  'gmail.com': 'gmail',
  'googlemail.com': 'gmail',
  'outlook.com': 'outlook',
  'hotmail.com': 'outlook',
  'live.com': 'outlook',
  'msn.com': 'outlook',
  'yahoo.com': 'yahoo',
  'yahoo.co.uk': 'yahoo',
  'yahoo.co.in': 'yahoo',
  'ymail.com': 'yahoo',
  'rocketmail.com': 'yahoo',
  'icloud.com': 'icloud',
  'me.com': 'icloud',
  'mac.com': 'icloud',
  'protonmail.com': 'proton',
  'protonmail.ch': 'proton',
  'proton.me': 'proton',
  'pm.me': 'proton',
  'aol.com': 'aol',
  'aim.com': 'aol',
  'zoho.com': 'zoho',
  'zohomail.com': 'zoho',
};

export const PROVIDERS: Record<string, EmailProvider> = {
  gmail: {
    name: 'Gmail',
    url: 'https://mail.google.com',
    color: '#EA4335',
    bgColor: 'rgba(234,67,53,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
  outlook: {
    name: 'Outlook',
    url: 'https://outlook.live.com',
    color: '#0078D4',
    bgColor: 'rgba(0,120,212,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547V9.863l2.527 1.753.198.09c.083 0 .15-.03.198-.09L24 7.387zM14.654 8.39V20H1.19c-.227 0-.42-.076-.578-.23A.774.774 0 01.375 19.2V4.801c0-.228.079-.421.237-.578.158-.155.351-.233.578-.233h7.283L14.654 8.39zm-4.18 2.344c-.655-.376-1.418-.564-2.29-.564-.872 0-1.637.193-2.296.578-.66.385-1.173.917-1.542 1.595-.368.679-.553 1.443-.553 2.293 0 .805.174 1.538.52 2.198.348.66.846 1.18 1.494 1.56.649.381 1.39.571 2.224.571.903 0 1.686-.195 2.349-.585.662-.39 1.172-.924 1.53-1.6.356-.678.535-1.435.535-2.272 0-.82-.183-1.563-.549-2.228a4.073 4.073 0 00-1.421-1.546zm-.84 5.773c-.34.465-.822.697-1.449.697-.416 0-.786-.113-1.107-.339a2.276 2.276 0 01-.759-.95 3.14 3.14 0 01-.271-1.321c0-.76.188-1.39.564-1.888.376-.498.876-.747 1.5-.747.607 0 1.093.243 1.459.73.365.487.548 1.123.548 1.906 0 .748-.162 1.347-.485 1.812zM24 5.56l-8.365 5.869-1.346-.942V7.063l-.117-.352-5.698-4.04h14.34c.227 0 .42.078.578.232.158.153.237.349.237.578V5.56z" />
      </svg>
    ),
  },
  yahoo: {
    name: 'Yahoo Mail',
    url: 'https://mail.yahoo.com',
    color: '#6001D2',
    bgColor: 'rgba(96,1,210,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M23.636 0L14.455 10.91 18.545 20.727h-4.363L12 14.182l-2.182 6.545H5.455L9.545 10.91.364 0h4.909l5.454 7.636L16.182 0h4.363z" />
        <circle cx="14.182" cy="22.909" r="1.091" />
      </svg>
    ),
  },
  icloud: {
    name: 'iCloud Mail',
    url: 'https://www.icloud.com/mail',
    color: '#3693F3',
    bgColor: 'rgba(54,147,243,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M13.762 3.467A6.619 6.619 0 0119.5 7.5c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5H5.25A5.256 5.256 0 010 11.25 5.256 5.256 0 014.151 6.08 6.613 6.613 0 0113.762 3.467z" />
      </svg>
    ),
  },
  proton: {
    name: 'Proton Mail',
    url: 'https://mail.proton.me',
    color: '#6D4AFF',
    bgColor: 'rgba(109,74,255,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M3.168 7.302L12 12.89l8.832-5.588A1.5 1.5 0 0019.5 6h-15a1.5 1.5 0 00-1.332.802V7.302zM21 9.118l-8.658 5.478a.75.75 0 01-.684 0L3 9.118V16.5A1.5 1.5 0 004.5 18h15a1.5 1.5 0 001.5-1.5V9.118z" />
      </svg>
    ),
  },
  aol: {
    name: 'AOL Mail',
    url: 'https://mail.aol.com',
    color: '#FF5A19',
    bgColor: 'rgba(255,90,25,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
  zoho: {
    name: 'Zoho Mail',
    url: 'https://mail.zoho.com',
    color: '#E8433A',
    bgColor: 'rgba(232,67,58,0.1)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  generic: {
    name: 'Email',
    url: '',
    color: '#888888',
    bgColor: 'rgba(136,136,136,0.1)',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
};

export function detectProvider(email: string): EmailProvider {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0) return PROVIDERS.generic;
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  const key = DOMAIN_MAP[domain];
  return key ? PROVIDERS[key]! : PROVIDERS.generic;
}
