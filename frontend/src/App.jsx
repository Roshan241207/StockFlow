import {
    Routes,
    Route,
    Navigate,
    Link
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import StockMovements from "./pages/StockMovements";
import Notifications from "./pages/Notifications";
import Sidebar from "./components/Sidebar";


// =========================
// CHECK LOGIN
// =========================

function isLoggedIn() {

    return !!localStorage.getItem(
        "stockflowUser"
    );
}


// =========================
// GET USER
// =========================

function getUser() {

    const storedUser =
        localStorage.getItem(
            "stockflowUser"
        );

    if (!storedUser) {
        return null;
    }

    try {

        return JSON.parse(
            storedUser
        );

    } catch {

        return null;
    }
}


// =========================
// DASHBOARD LAYOUT
// SIDEBAR IS ONLY HERE
// =========================

function DashboardLayout({
    children
}) {

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (

        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                {children}

            </main>

        </div>
    );
}


// =========================
// NORMAL PAGE LAYOUT
// NO SIDEBAR
// =========================

function StandaloneLayout({
    children
}) {

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (

        <div className="standalone-page">

            <div className="standalone-topbar">

                <Link
                    to="/"
                    className="dashboard-back-button"
                >
                    ← Dashboard
                </Link>

            </div>

            {children}

        </div>
    );
}


// =========================
// ADMIN DASHBOARD
// SIDEBAR IS SHOWN
// =========================

function AdminDashboard() {

    const user = getUser();

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role !== "ADMIN") {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (

        <div className="admin-page">

            <div className="admin-container">

                <span className="admin-label">
                    ADMINISTRATION
                </span>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Welcome, {user.username}.
                    Manage the StockFlow system
                    from this dashboard.
                </p>


                <div className="admin-cards">

                    <div className="admin-card">

                        <h3>
                            Inventory
                        </h3>

                        <p>
                            Manage categories,
                            products, suppliers
                            and customers.
                        </p>

                    </div>


                    <div className="admin-card">

                        <h3>
                            Stock Operations
                        </h3>

                        <p>
                            Monitor purchases,
                            sales and stock
                            movements.
                        </p>

                    </div>


                    <div className="admin-card">

                        <h3>
                            System Access
                        </h3>

                        <p>
                            You are logged in
                            with administrator
                            access.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


// =========================
// APP
// =========================

function App() {

    return (

        <Routes>


            {/* =========================
                PUBLIC PAGES
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* =========================
                FORGOT PASSWORD
                PUBLIC PAGE
            ========================= */}

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* =========================
                DASHBOARD
                SIDEBAR SHOWN
            ========================= */}

            <Route
                path="/"
                element={

                    <DashboardLayout>

                        <Dashboard />

                    </DashboardLayout>

                }
            />


            {/* =========================
                CATEGORIES
                NO SIDEBAR
            ========================= */}

            <Route
                path="/categories"
                element={

                    <StandaloneLayout>

                        <Categories />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                PRODUCTS
                NO SIDEBAR
            ========================= */}

            <Route
                path="/products"
                element={

                    <StandaloneLayout>

                        <Products />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                SUPPLIERS
                NO SIDEBAR
            ========================= */}

            <Route
                path="/suppliers"
                element={

                    <StandaloneLayout>

                        <Suppliers />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                CUSTOMERS
                NO SIDEBAR
            ========================= */}

            <Route
                path="/customers"
                element={

                    <StandaloneLayout>

                        <Customers />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                PURCHASES
                NO SIDEBAR
            ========================= */}

            <Route
                path="/purchases"
                element={

                    <StandaloneLayout>

                        <Purchases />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                SALES
                NO SIDEBAR
            ========================= */}

            <Route
                path="/sales"
                element={

                    <StandaloneLayout>

                        <Sales />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                STOCK MOVEMENTS
                NO SIDEBAR
            ========================= */}

            <Route
                path="/stock-movements"
                element={

                    <StandaloneLayout>

                        <StockMovements />

                    </StandaloneLayout>

                }
            />


            {/* =========================
                ADMIN
                SIDEBAR SHOWN
            ========================= */}

            <Route
                path="/admin"
                element={

                    <DashboardLayout>

                        <AdminDashboard />

                    </DashboardLayout>

                }
            />


            {/* =========================
                UNKNOWN ROUTE
            ========================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

            <Route
    path="/settings"
    element={

        <StandaloneLayout>

            <Settings />

        </StandaloneLayout>

    }
/>

<Route
    path="/notifications"
    element={

        <StandaloneLayout>

            <Notifications />

        </StandaloneLayout>

    }
/>

        </Routes>
    );
}


export default App;