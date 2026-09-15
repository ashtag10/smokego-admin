import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  adminRole?: string;
  iat: number;
  exp: number;
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "ADMIN" || false;
}