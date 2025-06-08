import { LoaderIcon } from "lucide-react";

export default function SpinnerDefault() {
  return (
    <div className="h-screen w-full fixed top-0 left-0 flex items-center justify-center z-50 bg-black backdrop-blur-2xl">
        <LoaderIcon className="animate-spin" />
    </div>
  );
}
