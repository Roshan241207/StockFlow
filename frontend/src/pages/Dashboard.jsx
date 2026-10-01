import { useEffect, useState } from "react";

import {
    getDashboard
} from "../services/api";


function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD DASHBOARD
    // =========================

    useEffect(() => {
        loadDashboard();
    }, []);


    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const data = await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // FORMAT MONEY
    // =========================

    function formatMoney(value) {

        return Number(value || 0)
            .toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }


    // =========================
    // FORMAT DATE
    // =========================

    function formatDate(value) {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();
    }


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-container">

                    <div className="dashboard-error">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Unable to load dashboard
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="dashboard-refresh-button"
                            onClick={loadDashboard}
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard-page">

            <div className="dashboard-container">


                {/* =========================
                    HERO HEADER
                ========================= */}

                <div className="dashboard-hero">

                    <div className="dashboard-hero-content">

                        <div className="dashboard-hero-icon">
                            SF
                        </div>

                        <div>

                            <span className="dashboard-eyebrow">
                                STOCKFLOW
                            </span>

                            <h1>
                                Inventory Dashboard
                            </h1>

                            <p>
                                Aluminium inventory overview and stock activity
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="dashboard-refresh-button"
                        onClick={loadDashboard}
                    >
                        ↻ Refresh
                    </button>

                </div>


                {/* =========================
                    SUMMARY CARDS
                ========================= */}

                <div className="dashboard-cards">


                    {/* TOTAL PRODUCTS */}

                    <div className="dashboard-card dashboard-card-blue">

                        <div className="dashboard-card-top">

                            <div className="dashboard-card-icon">
                                📦
                            </div>

                        </div>

                        <div className="dashboard-card-title">
                            Total Products
                        </div>

                        <div className="dashboard-card-value">
                            {dashboard.totalProducts}
                        </div>

                        <div className="dashboard-card-footer">
                            Products in inventory
                        </div>

                    </div>


                    {/* LOW STOCK */}

                    <div className="dashboard-card dashboard-card-orange">

                        <div className="dashboard-card-top">

                            <div className="dashboard-card-icon">
                                ⚠
                            </div>

                        </div>

                        <div className="dashboard-card-title">
                            Low Stock
                        </div>

                        <div className="dashboard-card-value">
                            {dashboard.lowStockCount}
                        </div>

                        <div className="dashboard-card-footer">
                            Products requiring attention
                        </div>

                    </div>


                    {/* TOTAL STOCK */}

                    <div className="dashboard-card dashboard-card-green">

                        <div className="dashboard-card-top">

                            <div className="dashboard-card-icon">
                                📊
                            </div>

                        </div>

                        <div className="dashboard-card-title">
                            Total Stock
                        </div>

                        <div className="dashboard-card-value">
                            {Number(
                                dashboard.totalStock || 0
                            ).toFixed(2)}
                        </div>

                        <div className="dashboard-card-footer">
                            Current inventory quantity
                        </div>

                    </div>


                    {/* STOCK VALUE */}

                    <div className="dashboard-card dashboard-card-purple">

                        <div className="dashboard-card-top">

                            <div className="dashboard-card-icon">
                                ₹
                            </div>

                        </div>

                        <div className="dashboard-card-title">
                            Stock Value
                        </div>

                        <div className="dashboard-card-value dashboard-money">
                            ₹
                            {formatMoney(
                                dashboard.stockValue
                            )}
                        </div>

                        <div className="dashboard-card-footer">
                            Based on purchase price
                        </div>

                    </div>

                </div>


                {/* =========================
                    MAIN GRID
                ========================= */}

                <div className="dashboard-grid">


                    {/* =========================
                        LOW STOCK
                    ========================= */}

                    <div className="dashboard-section">

                        <div className="dashboard-section-header">

                            <div>

                                <span className="section-label">
                                    INVENTORY ALERT
                                </span>

                                <h2>
                                    Low Stock Products
                                </h2>

                            </div>

                            <div className="section-count">
                                {dashboard.lowStockCount}
                            </div>

                        </div>


                        {dashboard.lowStockProducts &&
                        dashboard.lowStockProducts.length > 0 ? (

                            <div className="dashboard-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Code
                                            </th>

                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Current
                                            </th>

                                            <th>
                                                Minimum
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {dashboard
                                            .lowStockProducts
                                            .map(product => (

                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                >

                                                    <td>
                                                        <span className="product-code">
                                                            {
                                                                product.productCode
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                product.productName
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <span className="low-stock-number">
                                                            {
                                                                product.currentStock
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {
                                                            product.minimumStock
                                                        }
                                                    </td>

                                                </tr>

                                            ))}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="dashboard-empty">

                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>
                                    Stock levels look good
                                </h3>

                                <p>
                                    No products are currently below their minimum stock level.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =========================
                        RECENT MOVEMENTS
                    ========================= */}

                    <div className="dashboard-section">

                        <div className="dashboard-section-header">

                            <div>

                                <span className="section-label">
                                    ACTIVITY
                                </span>

                                <h2>
                                    Recent Stock Movements
                                </h2>

                            </div>

                            <div className="section-count">
                                {dashboard.recentMovements
                                    ? dashboard.recentMovements.length
                                    : 0}
                            </div>

                        </div>


                        {dashboard.recentMovements &&
                        dashboard.recentMovements.length > 0 ? (

                            <div className="movement-list">

                                {dashboard.recentMovements
                                    .map(movement => (

                                        <div
                                            className="movement-item"
                                            key={movement.id}
                                        >

                                            <div
                                                className={
                                                    movement.movementType
                                                        ?.toUpperCase() ===
                                                    "PURCHASE"
                                                        ? "movement-icon movement-icon-purchase"
                                                        : "movement-icon movement-icon-sale"
                                                }
                                            >

                                                {movement.movementType
                                                    ?.toUpperCase() ===
                                                "PURCHASE"
                                                    ? "↓"
                                                    : "↑"
                                                }

                                            </div>


                                            <div className="movement-content">

                                                <div className="movement-main-line">

                                                    <strong>
                                                        {movement.product
                                                            ? movement.product.productName
                                                            : "Unknown Product"
                                                        }
                                                    </strong>

                                                    <span
                                                        className={
                                                            movement.movementType
                                                                ?.toUpperCase() ===
                                                            "PURCHASE"
                                                                ? "movement-purchase"
                                                                : "movement-sale"
                                                        }
                                                    >
                                                        {
                                                            movement.movementType
                                                        }
                                                    </span>

                                                </div>


                                                <div className="movement-sub-line">

                                                    <span>
                                                        Qty:{" "}
                                                        {
                                                            movement.quantity
                                                        }
                                                    </span>

                                                    <span>
                                                        Stock:{" "}
                                                        {
                                                            movement.stockAfter
                                                        }
                                                    </span>

                                                </div>


                                                <div className="movement-reason">

                                                    {
                                                        movement.reason
                                                    }

                                                </div>

                                            </div>


                                            <div className="movement-date">

                                                {
                                                    formatDate(
                                                        movement.movementDate
                                                    )
                                                }

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        ) : (

                            <div className="dashboard-empty">

                                <div className="empty-icon">
                                    —
                                </div>

                                <h3>
                                    No recent activity
                                </h3>

                                <p>
                                    Purchase and sale movements will appear here.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Dashboard;