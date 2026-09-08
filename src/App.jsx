import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
import { sellerboardNav } from "./data/sellerboardData";

const sellerboardRoutes = sellerboardNav.flatMap((group) => group.items.map((item) => item.to));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
