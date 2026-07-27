import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Notes Reader",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading notes reader...</div>}>
      <ClientPage />
    </Suspense>
  );
}
