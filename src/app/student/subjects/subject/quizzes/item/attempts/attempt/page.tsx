import { Suspense } from "react";
import ClientPage from './ClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}