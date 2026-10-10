export interface TokenRecord {
  email: string;
  name?: string;
  city?: string;
  country_code?: string;
  expiresAt: number;
}

// Global in-memory token store across API route invocations
const globalStore = global as unknown as {
  __betadigest_tokens?: Map<string, TokenRecord>;
};

if (!globalStore.__betadigest_tokens) {
  globalStore.__betadigest_tokens = new Map<string, TokenRecord>();
}

export const tokenStore = globalStore.__betadigest_tokens;
