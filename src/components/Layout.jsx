import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f8fa] text-[#253044] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.div>
        <footer className="text-center text-[10px] tracking-widest text-slate-400 py-10">
          © 2024 INVENTORY INSIGHTS PRO • ENTERPRISE EDITION
        </footer>
      </main>
    </div>
  );
}
