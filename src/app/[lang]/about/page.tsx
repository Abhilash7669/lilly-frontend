import { getCookieLocale } from "@/lib/cookies/cookie"

export default async function Page() {

    const locale = await getCookieLocale();

  return (
    <div>About page in: {locale}</div>
  )
}