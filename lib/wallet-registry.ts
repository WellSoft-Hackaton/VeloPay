// In MVP: In-memory Map (lost on server restart)
// In Production: Replace with Supabase or PostgreSQL

const walletRegistry = new Map<string, string>();

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, "");
}

export function registerWallet(phone: string, walletAddress: string): void {
  walletRegistry.set(normalizePhone(phone), walletAddress);
  console.log(`[Registry] Registered ${normalizePhone(phone)} → ${walletAddress}`);
}

export function getWallet(phone: string): string | undefined {
  return walletRegistry.get(normalizePhone(phone));
}

export function hasWallet(phone: string): boolean {
  return walletRegistry.has(normalizePhone(phone));
}

// For Crossmint: create email-based wallet address
export function getOrCreateEmailWallet(email: string): string {
  const key = `email:${email.toLowerCase()}`;
  if (!walletRegistry.has(key)) {
    // In real implementation: call Crossmint API to create embedded wallet
    // For MVP: generate a placeholder address
    const placeholder = `crossmint_${email.replace("@", "_at_").replace(".", "_")}_${Date.now()}`;
    walletRegistry.set(key, placeholder);
  }
  return walletRegistry.get(key)!;
}

export function getRegistrySize(): number {
  return walletRegistry.size;
}
