import type { EmailProvider } from '@/constants/providers';

interface ProviderButtonProps {
  provider: EmailProvider;
}

export function ProviderButton({ provider }: ProviderButtonProps) {
  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2.5 w-full py-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      style={{
        borderColor: `${provider.color}30`,
        backgroundColor: provider.bgColor,
        color: provider.color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${provider.color}60`;
        e.currentTarget.style.backgroundColor = `${provider.color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${provider.color}30`;
        e.currentTarget.style.backgroundColor = provider.bgColor;
      }}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">{provider.icon}</span>
      <span className="text-sm font-semibold">Open {provider.name}</span>
      <svg
        className="w-4 h-4 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </a>
  );
}
