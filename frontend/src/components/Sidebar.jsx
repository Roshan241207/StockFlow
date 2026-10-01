import { NavLink, useNavigate } from "react-router-dom";


function Sidebar() {

    const navigate = useNavigate();

    const storedUser =
        localStorage.getItem("stockflowUser");

    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    function handleLogout() {

        localStorage.removeItem("stockflowUser");

        navigate("/login");
    }


    return (

        <aside className="sidebar">

            {/* =========================
                BRAND
            ========================= */}

            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    SF
                </div>

                <div>

                    <h2>
                        StockFlow
                    </h2>

                    <span>
                        Aluminium Inventory
                    </span>

                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="sidebar-nav">

                <div className="sidebar-section-title">
                    MAIN
                </div>


                {/* =========================
                    DASHBOARD
                ========================= */}

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ▦
                    </span>

                    Dashboard
                </NavLink>


                {/* =========================
                    INVENTORY
                ========================= */}

                <div className="sidebar-section-title">
                    INVENTORY
                </div>


                <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ▤
                    </span>

                    Categories
                </NavLink>


                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ◈
                    </span>

                    Products
                </NavLink>


                <NavLink
                    to="/suppliers"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ◉
                    </span>

                    Suppliers
                </NavLink>


                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ◎
                    </span>

                    Customers
                </NavLink>


                {/* =========================
                    STOCK OPERATIONS
                ========================= */}

                <div className="sidebar-section-title">
                    STOCK OPERATIONS
                </div>


                <NavLink
                    to="/purchases"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ↓
                    </span>

                    Purchases
                </NavLink>


                <NavLink
                    to="/sales"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ↑
                    </span>

                    Sales
                </NavLink>


                <NavLink
                    to="/stock-movements"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ⇄
                    </span>

                    Stock Movements
                </NavLink>


                {/* =========================
                    SYSTEM
                ========================= */}

                <div className="sidebar-section-title">
                    SYSTEM
                </div>


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        🔔
                    </span>

                    Notifications
                </NavLink>


                {/* =========================
                    SETTINGS
                ========================= */}

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "sidebar-link-active"
                                : ""
                        }`
                    }
                >
                    <span className="sidebar-icon">
                        ⚙
                    </span>

                    Settings
                </NavLink>


                {/* =========================
                    ADMIN
                ========================= */}

                {user?.role === "ADMIN" && (

                    <>

                        <div className="sidebar-section-title">
                            ADMINISTRATION
                        </div>


                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `sidebar-link ${
                                    isActive
                                        ? "sidebar-link-active"
                                        : ""
                                }`
                            }
                        >
                            <span className="sidebar-icon">
                                ★
                            </span>

                            Admin Dashboard
                        </NavLink>

                    </>

                )}

            </nav>


            {/* =========================
                USER AREA
            ========================= */}

            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <div className="sidebar-avatar">

                        {
                            user?.username
                                ?.charAt(0)
                                ?.toUpperCase() || "U"
                        }

                    </div>


                    <div className="sidebar-user-info">

                        <strong>
                            {user?.username || "User"}
                        </strong>

                        <span>
                            {user?.role || "USER"}
                        </span>

                    </div>

                </div>


                {/* =========================
                    LOGOUT
                ========================= */}

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    ↪ Logout
                </button>

            </div>

        </aside>
    );
}


export default Sidebar;