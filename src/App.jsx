import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { sellerboardNav } from "./data/sellerboardData";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const LowStockAlert = lazy(() => import("./pages/LowStockAlert"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Warehouse = lazy(() => import("./pages/Warehouse"));
const Orders = lazy(() => import("./pages/Orders"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const SellerboardPage = lazy(() => import("./pages/SellerboardPage"));

const sellerboardRoutes = sellerboardNav.flatMap((group) => group.items.map((item) => item.to));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
