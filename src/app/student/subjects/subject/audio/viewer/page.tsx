import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Audio Viewer",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading audio viewer...</div>}>
      <ClientPage />
    </Suspense>
  );
}
