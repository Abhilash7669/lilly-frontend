"use client"

import { Modal as UploadPictureModal } from "@/components/common/modal/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useState } from "react"

export default function Page() {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  

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
          description: "Choose a picture and upload"
        }}
        open={isModalOpen}
        setOpen={(e) => setIsModalOpen(e)}
        isLoading={false}
        onConfirm={async () => {}}
      >
        <Input 
          type="file"
        />
      </UploadPictureModal>
    </main>
  )
}