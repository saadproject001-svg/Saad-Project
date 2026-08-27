import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Rendered once at the app shell level (see App.jsx) so Sidebar and Header
// persist across navigations — only the routed page content underneath
// unmounts/animates between routes.
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("Inventory Overview");
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8f8fa] text-[#253044] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet context={setTitle} />
          </motion.div>
        </AnimatePresence>
        <footer className="text-center text-[10px] tracking-widest text-slate-400 py-10">
          © 2024 INVENTORY INSIGHTS PRO • ENTERPRISE EDITION
        </footer>
      </main>
    </div>
  );
}
