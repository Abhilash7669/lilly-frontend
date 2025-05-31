import { getCookieLocale } from '@/lib/cookies/cookie'
import React from 'react'

type Props = {}

export default async function page({}: Props) {

    const locale = await getCookieLocale();

  return (
    <div>
        <p>Blog in {locale}</p>
    </div>
  )
}