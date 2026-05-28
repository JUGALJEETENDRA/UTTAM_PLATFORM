import Sidebar from "@/components/layout/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user ? (session.user as any).role || "TEACHER" : "STUDENT";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col font-sans">
        <header className="flex h-16 items-center justify-between gap-4 px-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Dashboard</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}