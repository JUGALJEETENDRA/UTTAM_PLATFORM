import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "Quiz Player",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading quiz player...</div>}>
      <ClientPage />
    </Suspense>
  );
}
