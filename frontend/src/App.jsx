import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import RequirePlatformAdmin from "./components/RequirePlatformAdmin";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
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
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<RequireAuth />}>
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
            <Route element={<RequirePlatformAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminOrganizations />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/activity" element={<AdminActivity />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
