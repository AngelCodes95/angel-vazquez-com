/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CHAT_API_URL: string | undefined;
  readonly PUBLIC_SHARED_API: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
