declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    MONGODB_URL: string;
    SALTROUND: number;
    PRIV_KEY_A: string;
  }
}
