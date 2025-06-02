"use client";

// import { useEffect } from "react";

type Props = object;

export default function Page({}: Props) {

  // useEffect(() => {

  //   if("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
  //     console.log("Yes");

  //     navigator.mediaDevices.getUserMedia({ video: true })

  //   }
  

  // }, []);


  return (
    <div className="p-6 flex items-center justify-center">
      <p>
        Test QR Camera functionality
      </p>
      <p>
        Take a photo
      </p>
      <input type="file" accept="image/*" capture="environment" />
    </div>
  )
}