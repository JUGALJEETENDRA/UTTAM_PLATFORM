import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function StudentMindMapViewerPage({ params, searchParams }: any) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading viewer...</div>}>
      <ClientPage />
    </Suspense>
  );
}
