import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function ContentMatrixPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading Content Matrix...</div>}>
      <ClientPage />
    </Suspense>
  );
}
