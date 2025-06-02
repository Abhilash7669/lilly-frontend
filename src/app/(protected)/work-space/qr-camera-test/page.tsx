"use client";

import { useEffect } from "react";

type Props = object;

export default function Page({}: Props) {

  useEffect(() => {
  
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => console.log("YES") ).catch(() => console.log("REJECTED"));

  }, []);


  return (
    <div className="p-6 flex items-center justify-center">
      <p>
        Test QR Camera functionality
      </p>
    </div>
  )
}