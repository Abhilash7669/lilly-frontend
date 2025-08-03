"use client";

import { Modal as UploadPictureModal } from "@/components/common/modal/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { deleteCookie, getCookie } from "@/lib/cookies/cookie";
import { errorToast } from "@/lib/toast/toast-function";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  function handleImageChange(e: ChangeEvent<HTMLInputElement>): void {
    if (!e.target.files) return;
    // base64 33.33% larger and slower for large images
    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(e.target.files[0]);

    // fileReader.onload = (fileReaderEvenet) => {
    //   setPreviewUrl(fileReaderEvenet.target?.result);
    // };

    const file = e.target.files[0];

    const _previewUrl = URL.createObjectURL(file);

    if (!_previewUrl) {
      errorToast("Error", "Could not create a preview url");
      return;
    }

    setPreviewUrl(_previewUrl);
    setImage(file);
  }

  function handleModalState(e: boolean) {
    setIsModalOpen(e);
    if (!e) setPreviewUrl(null);
  }

  async function handleSubmit() {
    setLoading(true);
    if (!image) {
      errorToast("Error!", "No image found.");
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    
    formData.append("text", "profile/avatar/");
    formData.append("image", image);
    const _userId = await getCookie("lillyUser");
    
    if (!_userId) {
      errorToast("Error", "Detected Unauthorized user");
      await deleteCookie("lillyToken");
      router.push("/login");
      setLoading(false);
      return;
    }
    
    const result = await AXIOS_CLIENT.post(
      `/users/${_userId}/avatar`,
      formData
    );
    setLoading(false);
    console.log(result);
  }

  return (
    <main className="flex items-center justify-center">
      <div>
        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
          Upload Profile picture
        </Button>
      </div>
      <UploadPictureModal
        dialogHeader={{
          title: "Upload Picture",
          description: "Choose a picture and upload",
        }}
        open={isModalOpen}
        setOpen={(e) => handleModalState(e as boolean)}
        isLoading={loading}
        onConfirm={handleSubmit}
      >
        <div className="space-y-5">
          {previewUrl && (
            <div className="relative w-full h-[14rem] rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                fill
                alt="image"
                className="object-cover"
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/jpg, image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </div>
      </UploadPictureModal>
    </main>
  );
}
