import { apiClient } from "./apiClient";

// Auth / org bootstrap (backend: app/api/v1/{auth,organizations,users}.py)
export const getMyProfile = () => apiClient.get("/users/me");
export const listMyOrganizations = () => apiClient.get("/organizations/me");
export const createOrganization = (payload) => apiClient.post("/organizations", payload);
export const touchSession = () => apiClient.post("/auth/session-touch");

// Team (backend: app/api/v1/users.py)
export const listTeam = () => apiClient.get("/team");
export const inviteTeamMember = (payload) => apiClient.post("/team/invite", payload);
export const removeTeamMember = (membershipId) => apiClient.delete(`/team/${membershipId}`);
export const listRoles = () => apiClient.get("/roles");

// Dashboard (backend: app/api/v1/dashboard.py)
export const getDashboardSummary = () => apiClient.get("/dashboard/summary");

// Products (backend: app/api/v1/products.py)
export const listProducts = ({ page = 1, pageSize = 20, q, status } = {}) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  return apiClient.get(`/products?${params.toString()}`);
};
export const getProduct = (productId) => apiClient.get(`/products/${productId}`);
export const getLowStockProducts = () => apiClient.get("/products/low-stock");
export const getInventoryKpis = () => apiClient.get("/products/kpis");
export const createProduct = (payload) => apiClient.post("/products", payload);
export const updateProduct = (productId, payload) => apiClient.patch(`/products/${productId}`, payload);

// Suppliers (backend: app/api/v1/suppliers.py)
export const listSuppliers = () => apiClient.get("/suppliers");
export const createSupplier = (payload) => apiClient.post("/suppliers", payload);

// Warehouses (backend: app/api/v1/warehouses.py)
export const getWarehouseSummary = () => apiClient.get("/warehouses/summary");

// Orders (backend: app/api/v1/orders.py)
export const listOrders = ({ page = 1, pageSize = 20, type } = {}) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (type) params.set("type", type);
  return apiClient.get(`/orders?${params.toString()}`);
};
export const getOrder = (orderId) => apiClient.get(`/orders/${orderId}`);
export const createOrder = (payload) => apiClient.post("/orders", payload);
export const getCarrierPerformance = () => apiClient.get("/orders/carrier-performance");
export const getOrderKpis = () => apiClient.get("/orders/kpis");

// Analytics (backend: app/api/v1/analytics.py)
export const getAnalyticsSummary = () => apiClient.get("/analytics/summary");

// Sellerboard generic content (backend: app/api/v1/sellerboard.py)
export const getSellerboardPage = (pathname) => apiClient.get(`/sellerboard/pages${pathname}`);

// Platform admin (backend: app/api/v1/admin.py) — cross-tenant, platform-admin-only.
export const adminListOrganizations = () => apiClient.get("/admin/organizations");
export const adminListUsers = ({ page = 1, pageSize = 25 } = {}) =>
  apiClient.get(`/admin/users?page=${page}&page_size=${pageSize}`);
export const adminListActivity = ({ page = 1, pageSize = 25, organizationId } = {}) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (organizationId) params.set("organization_id", organizationId);
  return apiClient.get(`/admin/activity?${params.toString()}`);
};
export const adminListOrders = ({ page = 1, pageSize = 25, organizationId } = {}) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (organizationId) params.set("organization_id", organizationId);
  return apiClient.get(`/admin/orders?${params.toString()}`);
};
export const adminListProducts = ({ page = 1, pageSize = 25, organizationId } = {}) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (organizationId) params.set("organization_id", organizationId);
  return apiClient.get(`/admin/products?${params.toString()}`);
};
