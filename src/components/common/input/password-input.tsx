"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInput extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
const eyeProps = {
  class: "absolute top-2/4 -translate-y-2/4 right-3 cursor-pointer active:scale-95 transition-all",
  size: 16
};

export default function PasswordInput({ className, ...props }: PasswordInput) {
  const [showPassword, setShowPassword] = useState<boolean>(false);


  function handleToggle(visibleState: boolean): void {
    setShowPassword(() => visibleState);
  }

  return (
    <div className={cn("w-full relative", className)}>
      <Input type={showPassword ? "text" : "password"} {...props} />
      {showPassword ? (
        <EyeIcon onClick={() => handleToggle(false)} className={eyeProps.class} size={eyeProps.size} />
      ) : (
        <EyeOffIcon onClick={() => handleToggle(true)} className={eyeProps.class} size={eyeProps.size} />
      )}
    </div>
  );
}
