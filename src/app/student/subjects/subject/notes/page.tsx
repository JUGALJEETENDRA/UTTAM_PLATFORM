import { Suspense } from "react";
import ClientPage from './ClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center bg-[#FAF9F5] min-h-screen">Loading Notes Library...</div>}>
      <ClientPage />
    </Suspense>
  );
}
