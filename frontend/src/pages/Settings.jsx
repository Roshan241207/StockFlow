import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("stockflowDarkMode") === "true"
    );

    const [lowStockAlerts, setLowStockAlerts] = useState(
        localStorage.getItem("stockflowLowStockAlerts") !== "false"
    );

    const [purchaseNotifications, setPurchaseNotifications] = useState(
        localStorage.getItem("stockflowPurchaseNotifications") !== "false"
    );

    const [saleNotifications, setSaleNotifications] = useState(
        localStorage.getItem("stockflowSaleNotifications") !== "false"
    );

    const [compactMode, setCompactMode] = useState(
        localStorage.getItem("stockflowCompactMode") === "true"
    );

    const [language, setLanguage] = useState(
        localStorage.getItem("stockflowLanguage") || "English"
    );

    const [dateFormat, setDateFormat] = useState(
        localStorage.getItem("stockflowDateFormat") || "DD-MM-YYYY"
    );


    // =========================================
    // LOAD USER
    // =========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("stockflowUser");

        if (storedUser) {

            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch {

                setUser(null);

            }

        }

    }, []);


    // =========================================
    // DARK MODE
    // =========================================

    useEffect(() => {

        if (darkMode) {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );

        }

        localStorage.setItem(
            "stockflowDarkMode",
            darkMode
        );

    }, [darkMode]);


    // =========================================
    // COMPACT MODE
    // =========================================

    useEffect(() => {

        if (compactMode) {

            document.body.classList.add(
                "compact-mode"
            );

        } else {

            document.body.classList.remove(
                "compact-mode"
            );

        }

        localStorage.setItem(
            "stockflowCompactMode",
            compactMode
        );

    }, [compactMode]);


    // =========================================
    // NOTIFICATION SETTINGS
    // =========================================

    function updateSetting(
        key,
        value,
        setter
    ) {

        setter(value);

        localStorage.setItem(
            key,
            value
        );
    }


    // =========================================
    // LOGOUT
    // =========================================

    function handleLogout() {

        localStorage.removeItem(
            "stockflowUser"
        );

        navigate("/login");
    }


    if (!user) {

        return (

            <div className="settings-page">

                <div className="settings-container">

                    <h1>Settings</h1>

                    <p>
                        User information not available.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="settings-page">

            <div className="settings-container">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="settings-header">

                    <div>

                        <span className="settings-label">
                            SYSTEM SETTINGS
                        </span>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Customize your StockFlow
                            experience and preferences.
                        </p>

                    </div>

                </div>


                {/* =================================
                    APPEARANCE
                ================================= */}

                <div className="settings-section">

                    <div className="settings-section-heading">

                        <div className="settings-section-icon">
                            🎨
                        </div>

                        <div>

                            <h2>
                                Appearance
                            </h2>

                            <p>
                                Customize how StockFlow
                                looks on your screen.
                            </p>

                        </div>

                    </div>


                    {/* DARK MODE */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Dark Mode
                            </div>

                            <div className="settings-row-description">
                                Use a dark theme throughout
                                the application.
                            </div>

                        </div>

                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) =>
                                    setDarkMode(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>


                    {/* COMPACT MODE */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Compact Mode
                            </div>

                            <div className="settings-row-description">
                                Reduce spacing and make the
                                interface more compact.
                            </div>

                        </div>

                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={compactMode}
                                onChange={(e) =>
                                    setCompactMode(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>

                </div>


                {/* =================================
                    NOTIFICATIONS
                ================================= */}

                <div className="settings-section">

                    <div className="settings-section-heading">

                        <div className="settings-section-icon">
                            🔔
                        </div>

                        <div>

                            <h2>
                                Notifications
                            </h2>

                            <p>
                                Choose which system alerts
                                you want to receive.
                            </p>

                        </div>

                    </div>


                    {/* LOW STOCK */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Low Stock Alerts
                            </div>

                            <div className="settings-row-description">
                                Show alerts when a product
                                reaches its minimum stock level.
                            </div>

                        </div>

                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={lowStockAlerts}
                                onChange={(e) =>
                                    updateSetting(
                                        "stockflowLowStockAlerts",
                                        e.target.checked,
                                        setLowStockAlerts
                                    )
                                }
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>


                    {/* PURCHASE */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Purchase Notifications
                            </div>

                            <div className="settings-row-description">
                                Notify when new stock is
                                added through purchases.
                            </div>

                        </div>

                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={purchaseNotifications}
                                onChange={(e) =>
                                    updateSetting(
                                        "stockflowPurchaseNotifications",
                                        e.target.checked,
                                        setPurchaseNotifications
                                    )
                                }
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>


                    {/* SALES */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Sales Notifications
                            </div>

                            <div className="settings-row-description">
                                Notify when stock is reduced
                                through sales.
                            </div>

                        </div>

                        <label className="toggle">

                            <input
                                type="checkbox"
                                checked={saleNotifications}
                                onChange={(e) =>
                                    updateSetting(
                                        "stockflowSaleNotifications",
                                        e.target.checked,
                                        setSaleNotifications
                                    )
                                }
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>

                </div>


                {/* =================================
                    PREFERENCES
                ================================= */}

                <div className="settings-section">

                    <div className="settings-section-heading">

                        <div className="settings-section-icon">
                            ⚙
                        </div>

                        <div>

                            <h2>
                                Preferences
                            </h2>

                            <p>
                                Set your preferred application
                                options.
                            </p>

                        </div>

                    </div>


                    {/* LANGUAGE */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Language
                            </div>

                            <div className="settings-row-description">
                                Select the application language.
                            </div>

                        </div>

                        <select
                            className="settings-select"
                            value={language}
                            onChange={(e) => {

                                setLanguage(
                                    e.target.value
                                );

                                localStorage.setItem(
                                    "stockflowLanguage",
                                    e.target.value
                                );

                            }}
                        >
                            <option value="English">
                                English
                            </option>

                            <option value="Tamil">
                                Tamil
                            </option>

                        </select>

                    </div>


                    {/* DATE FORMAT */}

                    <div className="settings-row">

                        <div className="settings-row-info">

                            <div className="settings-row-title">
                                Date Format
                            </div>

                            <div className="settings-row-description">
                                Choose how dates are displayed.
                            </div>

                        </div>

                        <select
                            className="settings-select"
                            value={dateFormat}
                            onChange={(e) => {

                                setDateFormat(
                                    e.target.value
                                );

                                localStorage.setItem(
                                    "stockflowDateFormat",
                                    e.target.value
                                );

                            }}
                        >

                            <option value="DD-MM-YYYY">
                                DD-MM-YYYY
                            </option>

                            <option value="MM-DD-YYYY">
                                MM-DD-YYYY
                            </option>

                            <option value="YYYY-MM-DD">
                                YYYY-MM-DD
                            </option>

                        </select>

                    </div>

                </div>


                {/* =================================
                    ACCOUNT
                ================================= */}

                <div className="settings-section">

                    <div className="settings-section-heading">

                        <div className="settings-section-icon">
                            👤
                        </div>

                        <div>

                            <h2>
                                Account
                            </h2>

                            <p>
                                View your StockFlow account
                                information.
                            </p>

                        </div>

                    </div>


                    <div className="account-information">

                        <div className="account-avatar">
                            {
                                user.username
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            }
                        </div>

                        <div className="account-details">

                            <strong>
                                {user.username}
                            </strong>

                            <span>
                                {user.email}
                            </span>

                            <span>
                                {user.role} · {user.status}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================
                    SECURITY
                ================================= */}

                <div className="settings-section">

                    <div className="settings-section-heading">

                        <div className="settings-section-icon">
                            🔐
                        </div>

                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Manage your account security.
                            </p>

                        </div>

                    </div>


                    <div className="settings-action-row">

                        <div>

                            <div className="settings-row-title">
                                Change Password
                            </div>

                            <div className="settings-row-description">
                                Reset your account password
                                using Gmail OTP verification.
                            </div>

                        </div>

                        <button
                            type="button"
                            className="settings-action-button"
                            onClick={() =>
                                navigate("/forgot-password")
                            }
                        >
                            Change Password
                        </button>

                    </div>

                </div>


                {/* =================================
                    LOGOUT
                ================================= */}

                <div className="settings-logout-section">

                    <button
                        type="button"
                        className="settings-logout-button"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </div>

        </div>
    );
}


export default Settings;