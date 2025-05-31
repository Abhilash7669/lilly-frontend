"use server";

import { cookies } from "next/headers";

export async function setCookie(token: string): Promise<boolean> {
  if (!token) return false;

  const cookieStore = await cookies();

  cookieStore.set("lillyToken", token);
  return true;
}

export async function getCookie(): Promise<Record<string, string> | boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("lillyToken");

  if (!cookieValue) return false;
  return cookieValue;
}
