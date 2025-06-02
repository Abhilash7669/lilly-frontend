"use client";

import AuthFormLayout from "@/app/(auth)/_component/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRef, useState } from "react";

// import { useEffect } from "react";

type Props = object;

export default function Page({}: Props) {
  const [imageSrc, setImageSrc] = useState<{ src: string; hasImage: boolean }>({
    src: "",
    hasImage: false,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    // const formData = new FormData();

    if (e.target && e.target.files) {
      const imageData = e.target.files[0];

      const imageSrc = URL.createObjectURL(imageData);

      console.log(e.target.files[0]);

      setImageSrc(() => ({ src: imageSrc, hasImage: true }));

    }

  }

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <AuthFormLayout title="Hi!" description="Testing QR triggered Camera">
        {imageSrc.hasImage && (
          <div className="space-y-4">
            <Image
              src={imageSrc.src}
              height={800}
              width={800}
              alt="image"
              className="object-cover"
            />
            <div className="flex items-center gap-2">
              <Button>Submit</Button>
              <Button
                onClick={() =>
                  setImageSrc(() => ({ src: "", hasImage: false }))
                }
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!imageSrc.hasImage && (
          <div className="space-y-2">
            <Input
              className="hidden"
              ref={imageRef}
              type="file"
              name="qrImage"
              accept="image/*"
              capture="environment"
              onChange={handleSubmit}
            />
            <Button onClick={() => imageRef.current?.click()}>
              Upload Image
            </Button>
          </div>
        )}
      </AuthFormLayout>
    </div>
  );
}
