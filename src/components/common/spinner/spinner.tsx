import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div className="animate-spin flex items-center justify-center">
      <Loader />
    </div>
  );
}
