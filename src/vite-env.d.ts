/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_OTP_LENGTH?: string;
  readonly VITE_RESEND_COOLDOWN_SECONDS?: string;
  readonly VITE_OTP_EXPIRY_MINUTES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
