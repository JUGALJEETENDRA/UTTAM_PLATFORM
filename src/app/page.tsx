"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      if (res.ok) {
        setSubjects(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Student Dashboard</h1>
            <p className="text-gray-500 font-medium">Ready to start learning?</p>
          </div>
          
          {session ? (
            <div className="flex items-center gap-4">
              {(session.user as any)?.role === 'TEACHER' && (
                <Link 
                  href="/faculty/dashboard" 
                  className="btn-primary bg-red-600 text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-red-700 transition shadow-sm"
                >
                  Faculty Dashboard
                </Link>
              )}
              <button 
                onClick={() => signOut()}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-medium shadow-sm hover:bg-gray-50 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google', { callbackUrl: '/faculty/dashboard' }, { prompt: 'consent', access_type: 'offline', scope: 'openid email profile https://www.googleapis.com/auth/drive.file' })} 
              className="border border-red-500 text-red-600 bg-white py-2 px-6 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-red-50 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              Faculty Login
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Subjects</h2>
          
          {subjects.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500 shadow-sm">
              No subjects have been published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <Link key={subject.id} href={`/subject/${subject.id}`} className="block group">
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col">
                    <div className={`h-3 w-full bg-gradient-to-r ${subject.coverColor || 'from-red-500 to-orange-400'}`}></div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">{subject.code}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.title}</h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{subject.description}</p>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">{subject.modules?.length || 0} Modules</span>
                        <span className="text-sm font-bold text-red-600 group-hover:text-red-700">Enter Course →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
