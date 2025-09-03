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

  // const [test, setTest] = useState({ dia: 200, rotate: 360 });
  // const [items, _] = useState(10);
  // const dummyData = Array.from({ length: items }, (_, i) => i);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setTest((prev) => ({
  //       dia: prev.dia === 80 ? 200 : 80,
  //       rotate: prev.rotate === 360 ? 10 : 360,
  //     }));
  //   }, 2600);

  //   return () => clearTimeout(timeout);
  // }, [test.dia]);

  // const radius = (test.dia / 10) * 10; // scale logic
  // const n = dummyData.length;

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <h1 className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 animate-pulse text-xl">
        Redirecting you
      </h1>
      {/* <div
        className="relative rounded-full"
        style={{
          height: `${test.dia}px`,
          width: `${test.dia}px`,
          transformOrigin: "center",
          transform: `rotate(${test.rotate}deg)`,
          transition: "all 2s ease",
        }}
      > */}
        {/* dots */}
        {/* {dummyData.map((_, index) => {
          const sectorAngle = (360 / n) * index;
          const angleInRad = (sectorAngle * Math.PI) / 180;

          const x = Math.cos(angleInRad) * radius - 5;
          const y = Math.sin(angleInRad) * radius - 5;

          const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)})`;

          return (
            <div
              key={index}
              className="absolute top-2/4 left-2/4 h-[10px] w-[10px] rounded-full"
              style={{
                backgroundColor: color,
                transform: `translate(${x}px, ${y}px)`,
                transition: "all 3s ease",
              }}
            />
          );
        })} */}
      {/* </div> */}
    </div>
  );
}
