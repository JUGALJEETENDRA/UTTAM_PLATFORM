import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Infographic Viewer",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading infographic viewer...</div>}>
      <ClientPage />
    </Suspense>
  );
}
