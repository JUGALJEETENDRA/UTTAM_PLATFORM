import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Video Viewer",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading video viewer...</div>}>
      <ClientPage />
    </Suspense>
  );
}
