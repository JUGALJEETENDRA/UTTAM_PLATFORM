import ClientPage from "./ClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NotebookLM Watermark Remover - Faculty Tools",
  description: "Locally remove NotebookLM watermarks from Videos, PDFs, and PPTX.",
};

export default function NotebookLMRemoverPage() {
  return <ClientPage />;
}
