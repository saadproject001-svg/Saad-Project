import { useState } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ShaderBackground from "./ShaderBackground";

// <Outlet> re-renders live off router context, so an exiting AnimatePresence
// copy (kept mounted during its exit animation) silently swaps to whatever
// route is now current instead of continuing to show the page it was
// animating out. That left two full-height copies stacked — an invisible
// one on top pushing the real, visible one below the fold. Freezing the
// outlet element on first mount keeps each animated copy locked to the
// route it was created for.
function FrozenOutlet({ context }) {
  const outlet = useOutlet(context);
  const [frozen] = useState(() => outlet);
  return frozen;
}

// Rendered once at the app shell level (see App.jsx) so Sidebar and Header
// persist across navigations — only the routed page content underneath
// unmounts/animates between routes.
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("Inventory Overview");
  const location = useLocation();

  return (
    <div className="min-h-screen text-neu-text flex">
      <ShaderBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <AnimatePresence mode="sync">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <FrozenOutlet context={setTitle} />
          </motion.div>
        </AnimatePresence>
        <footer className="text-center text-[10px] tracking-widest text-neu-muted py-10">
          © 2024 INVENTORY INSIGHTS PRO • ENTERPRISE EDITION
        </footer>
      </main>
    </div>
  );
}
