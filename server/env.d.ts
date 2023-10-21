declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    MONGODB_URL: string;
    SALTROUND: number;
    PRIV_KEY_A: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
  }
}
