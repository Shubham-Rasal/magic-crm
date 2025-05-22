"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="py-4 px-6 border-b border-gray-800 bg-[rgb(26,28,32)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Magic CRM</h1>
        
        {session?.user && (
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[rgb(39,154,170)] flex items-center justify-center text-white">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="text-gray-300 text-sm hidden md:inline-block">
                {session.user.name || session.user.email}
              </span>
            </div>
            
            <motion.button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-gray-700/50 text-sm"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              <span className="hidden md:inline-block">Sign Out</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
