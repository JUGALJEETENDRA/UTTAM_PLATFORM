import Link from "next/link";
import { Globe, Mail, Phone, MapPin, GraduationCap, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 pt-10 pb-6 border-t-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Logo & About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">Gamified Learning Platform</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              A comprehensive gamified environment dedicated to mastering User Interface Design and Human-Computer Interaction principles.
            </p>
          </div>

          {/* Team Description */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              Our Team
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-1">
              Discover the engineering roles, layout frameworks, and collaborative contributions behind this project.
            </p>
            <div className="pt-1">
              <Link 
                href="/team" 
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 border border-red-600 hover:border-red-700 shadow-md hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Team Description</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Department of Information Technology,<br />Engineering College Campus.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>+91 22 6728 3000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>info.engg@somaiya.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 mt-4 flex flex-col md:flex-row justify-between items-center text-[11px] text-zinc-550">
          <p>© {new Date().getFullYear()} HCI EdTech Platform. All rights reserved.</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 md:mt-0 text-right md:text-left">
            <p>Designed for Educational Purposes</p>
            <span className="hidden md:inline">•</span>
            <p suppressHydrationWarning>
              Last updated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} IST
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
