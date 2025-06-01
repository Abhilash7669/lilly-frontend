"use server";

import { cookies } from "next/headers";

export async function setCookie(token: string): Promise<boolean> {
  if (!token) return false;

  const cookieStore = await cookies();

  cookieStore.set("lillyToken", token, { httpOnly: true });
  return true;
}

export async function getCookie(): Promise<Record<string, string> | boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("lillyToken");

  if (!cookieValue) return false;
  return cookieValue;
}


export async function setCookieValue({ key, value }: { key: string, value: string }): Promise<boolean> {

  const cookieStore = await cookies();

  cookieStore.set(key, value, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 });

  return true;

}

export async function setCookieLocale(locale: string) {

  if(!locale) return false;

  const cookieStore = await cookies();
  cookieStore.set("locale", locale, { httpOnly: true, maxAge: 60 * 60  });

  return true;

}

export async function getCookieLocale(): Promise<string | null> {

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("locale")?.value;

  if(!cookieValue) return null;

  return cookieValue;

}
