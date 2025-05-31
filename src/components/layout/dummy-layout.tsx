"use client"

import { setCookieLocale } from "@/lib/cookies/cookie"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
}

export default function DummyLayout({ children }: Props) {

    const router = useRouter();
    const pathName = usePathname();

    async function handleLocaleChange(locale: "fr" | "en" | "nl"): Promise<void> {

        const hasLocaleChanged = await setCookieLocale(locale);
        if(hasLocaleChanged) {
            const currrentPath = pathName;
            const segments = currrentPath.split("/").filter(Boolean);

            const localeSegement = segments[0];
            const restOfPath = segments.slice(1).join("/");

            router.push(`/${locale}/${restOfPath}`);

        }
    }

  return (
    <>
    <div className="flex items-center justify-between">
        <p onClick={() => handleLocaleChange("fr")}>
            fr
        </p>
        <p onClick={() => handleLocaleChange("en")}>
            en
        </p>
        <p onClick={() => handleLocaleChange("nl")}>
            nl
        </p>
        <Link href="/blog">
            Blog
        </Link>
        <Link href="/about">
            About
        </Link>
    </div>
    { children }
    </>
  )
}