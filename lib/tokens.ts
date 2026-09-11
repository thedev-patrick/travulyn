import { customAlphabet } from "nanoid";

const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const generate = customAlphabet(alphabet, 32);

export function generatePortalToken(): string {
  return generate();
}

export function portalUrlFor(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/portal/${token}`;
}
