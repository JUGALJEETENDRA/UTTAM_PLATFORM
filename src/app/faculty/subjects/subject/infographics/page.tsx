import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function FacultyInfographicsPage({ params, searchParams }: any) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
