import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { sellerboardNav } from "./data/sellerboardData";

// A new deploy changes the hashed chunk filenames. If a tab was left open
// across a deploy, its in-memory bundle still references the old (now
// missing) chunk URLs, so a lazy import 404s and the route renders blank.
// Reload once to pick up the fresh bundle instead of leaving a dead page.
function lazyWithReload(factory) {
  return lazy(() =>
    factory()
      .then((mod) => {
        sessionStorage.removeItem("chunk-reload-attempted");
        return mod;
      })
      .catch((error) => {
        if (!sessionStorage.getItem("chunk-reload-attempted")) {
          sessionStorage.setItem("chunk-reload-attempted", "1");
          window.location.reload();
          return new Promise(() => {});
        }
        throw error;
      })
  );
}

const Dashboard = lazyWithReload(() => import("./pages/Dashboard"));
const Inventory = lazyWithReload(() => import("./pages/Inventory"));
const ProductDetails = lazyWithReload(() => import("./pages/ProductDetails"));
const LowStockAlert = lazyWithReload(() => import("./pages/LowStockAlert"));
const Suppliers = lazyWithReload(() => import("./pages/Suppliers"));
const Warehouse = lazyWithReload(() => import("./pages/Warehouse"));
const Orders = lazyWithReload(() => import("./pages/Orders"));
const Analytics = lazyWithReload(() => import("./pages/Analytics"));
const Settings = lazyWithReload(() => import("./pages/Settings"));
const SellerboardPage = lazyWithReload(() => import("./pages/SellerboardPage"));

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
