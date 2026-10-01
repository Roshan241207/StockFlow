import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";


// =========================
// GLOBAL STYLES
// =========================

import "./styles/global.css";
import "./styles/auth.css";
import "./styles/category.css";
import "./styles/product.css";
import "./styles/supplier.css";
import "./styles/customer.css";
import "./styles/purchase.css";
import "./styles/sale.css";
import "./styles/stock-movement.css";
import "./styles/dashboard.css";
import "./styles/layout.css";
import "./styles/settings.css";
import "./styles/notifications.css";


// =========================
// RENDER APP
// =========================

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </React.StrictMode>
);