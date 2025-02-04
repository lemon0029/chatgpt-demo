/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly HTTPS_PROXY: string
  readonly OPENAI_API_BASE_URL: string
  readonly HEAD_SCRIPTS: string
  readonly PUBLIC_SECRET_KEY: string
  readonly SITE_PASSWORD: string
  readonly OPENAI_API_MODEL: string

  readonly RESOURCE_NAME: String
  readonly DEPLOYMENT_ID: String
  readonly API_KEY: String
  readonly API_VERSION: String

  readonly PUBLIC_MAX_HISTORY_MESSAGES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
