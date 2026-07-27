import { Suspense } from "react";
import ClientPage from "./ClientPage";

export const metadata = {
  title: "PDF Reader",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading PDF reader...</div>}>
      <ClientPage />
    </Suspense>
  );
}
