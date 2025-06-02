import { getCookieLocale } from '@/lib/cookies/cookie'


export default async function page() {

    const locale = await getCookieLocale();

  return (
    <div>
        <p>Blog in {locale}</p>
    </div>
  )
}