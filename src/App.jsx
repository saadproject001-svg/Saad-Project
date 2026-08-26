import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ProductDetails from "./pages/ProductDetails";
import LowStockAlert from "./pages/LowStockAlert";
import Suppliers from "./pages/Suppliers";
import Warehouse from "./pages/Warehouse";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import SellerboardPage from "./pages/SellerboardPage";
import { sellerboardPages } from "./data/sellerboardData";

const sellerboardRoutes = Object.keys(sellerboardPages);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/alerts" element={<LowStockAlert />} />
        <Route path="/inventory/:productId" element={<ProductDetails />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        {sellerboardRoutes.map((path) => (
          <Route key={path} path={path} element={<SellerboardPage />} />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
