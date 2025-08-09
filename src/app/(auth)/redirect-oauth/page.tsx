/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { setCookieValue } from "@/lib/cookies/cookie";
import { useSetAvatar, useSetUsername } from "@/store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [isError, setIsError] = useState(false);

  const params = useSearchParams();

  const router = useRouter();

  const token = params.get("token");
  const userId = params.get("userId");
  const userName = params.get("userName");
  const avatar = params.get("avatar");

  const setUserAvatar = useSetAvatar();
  const setUsername = useSetUsername();

  useEffect(() => {
    (async () => {
      if (!token || !userId || !userName) {
        // set error here
        setIsError(true);
        return;
      }
      setUserAvatar(avatar);    
      setUsername(userName);

      const isCookieSet = await setCookieValue({
        key: "lillyToken",
        value: token,
      });

      const isUserIdSet = await setCookieValue({
        key: "lillyUser",
        value: userId,
      });
      console.log(avatar, "AVATAR");

      if (isCookieSet && isUserIdSet) router.push("/dashboard/workspace");
    })();
  }, [token, userId, userName, avatar]);

  if (isError)
    return (
      <h1 className="text-red-500 mx-auto w-full flex items-center justify-center">
        Unauthorised ERROR!
      </h1>
    );
}
