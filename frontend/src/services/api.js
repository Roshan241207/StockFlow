const API_BASE_URL = "http://localhost:8080/api";


// =========================
// AUTH
// =========================

export async function loginUser(username, password) {

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed."
        );
    }

    return data;
}


export async function registerUser(username, email, password) {

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed."
        );
    }

    return data;
}


// =========================
// CATEGORY
// =========================

export async function getCategories() {

    const response = await fetch(
        `${API_BASE_URL}/categories`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load categories."
        );
    }

    return data;
}


export async function createCategory(
    name,
    description
) {

    const response = await fetch(
        `${API_BASE_URL}/categories`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to create category."
        );
    }

    return data;
}


export async function updateCategory(
    id,
    name,
    description
) {

    const response = await fetch(
        `${API_BASE_URL}/categories/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to update category."
        );
    }

    return data;
}


export async function deleteCategory(id) {

    const response = await fetch(
        `${API_BASE_URL}/categories/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete category."
        );
    }
}


// =========================
// PRODUCT
// =========================

export async function getProducts() {

    const response = await fetch(
        `${API_BASE_URL}/products`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load products."
        );
    }

    return data;
}


export async function createProduct(product) {

    const response = await fetch(
        `${API_BASE_URL}/products`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to create product."
        );
    }

    return data;
}


export async function updateProduct(
    id,
    product
) {

    const response = await fetch(
        `${API_BASE_URL}/products/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to update product."
        );
    }

    return data;
}


export async function deleteProduct(id) {

    const response = await fetch(
        `${API_BASE_URL}/products/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete product."
        );
    }
}

// =========================
// SUPPLIER
// =========================

export async function getSuppliers() {

    const response = await fetch(
        `${API_BASE_URL}/suppliers`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load suppliers."
        );
    }

    return data;
}


export async function createSupplier(supplier) {

    const response = await fetch(
        `${API_BASE_URL}/suppliers`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplier)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create supplier."
        );
    }

    return data;
}


export async function updateSupplier(id, supplier) {

    const response = await fetch(
        `${API_BASE_URL}/suppliers/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplier)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update supplier."
        );
    }

    return data;
}


export async function deleteSupplier(id) {

    const response = await fetch(
        `${API_BASE_URL}/suppliers/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete supplier."
        );
    }
}

// =========================
// CUSTOMER
// =========================

export async function getCustomers() {

    const response = await fetch(
        `${API_BASE_URL}/customers`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load customers."
        );
    }

    return data;
}


export async function createCustomer(customer) {

    const response = await fetch(
        `${API_BASE_URL}/customers`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create customer."
        );
    }

    return data;
}


export async function updateCustomer(id, customer) {

    const response = await fetch(
        `${API_BASE_URL}/customers/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update customer."
        );
    }

    return data;
}


export async function deleteCustomer(id) {

    const response = await fetch(
        `${API_BASE_URL}/customers/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to delete customer."
        );
    }
}

// =========================
// PURCHASE
// =========================

export async function getPurchases() {

    const response = await fetch(
        `${API_BASE_URL}/purchases`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load purchases."
        );
    }

    return data;
}


export async function getPurchaseById(id) {

    const response = await fetch(
        `${API_BASE_URL}/purchases/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load purchase."
        );
    }

    return data;
}


export async function getPurchaseItems(id) {

    const response = await fetch(
        `${API_BASE_URL}/purchases/${id}/items`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load purchase items."
        );
    }

    return data;
}


export async function createPurchase(purchase) {

    const response = await fetch(
        `${API_BASE_URL}/purchases`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(purchase)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create purchase."
        );
    }

    return data;
}

// =========================
// SALE
// =========================

export async function getSales() {

    const response = await fetch(
        `${API_BASE_URL}/sales`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load sales."
        );
    }

    return data;
}


export async function getSaleById(id) {

    const response = await fetch(
        `${API_BASE_URL}/sales/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load sale."
        );
    }

    return data;
}


export async function getSaleItems(id) {

    const response = await fetch(
        `${API_BASE_URL}/sales/${id}/items`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load sale items."
        );
    }

    return data;
}


export async function createSale(sale) {

    const response = await fetch(
        `${API_BASE_URL}/sales`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sale)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create sale."
        );
    }

    return data;
}

// =========================
// STOCK MOVEMENT
// =========================

export async function getStockMovements() {

    const response = await fetch(
        `${API_BASE_URL}/stock-movements`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load stock movements."
        );
    }

    return data;
}


export async function getProductStockMovements(productId) {

    const response = await fetch(
        `${API_BASE_URL}/stock-movements/product/${productId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load product stock movements."
        );
    }

    return data;
}


export async function getRecentStockMovements() {

    const response = await fetch(
        `${API_BASE_URL}/stock-movements/recent`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load recent stock movements."
        );
    }

    return data;
}

// =========================
// DASHBOARD
// =========================

export async function getDashboard() {

    const response = await fetch(
        `${API_BASE_URL}/dashboard`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load dashboard."
        );
    }

    return data;
}

// =========================
// FORGOT PASSWORD
// =========================

export async function sendForgotPasswordOtp(email) {

    const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to send OTP."
        );
    }

    return data;
}


export async function verifyForgotPasswordOtp(
    email,
    otp
) {

    const response = await fetch(
        `${API_BASE_URL}/auth/verify-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                otp
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Invalid OTP."
        );
    }

    return data;
}


export async function resetForgotPassword(
    email,
    otp,
    newPassword
) {

    const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                otp,
                newPassword
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to reset password."
        );
    }

    return data;
}

// =========================================
// NOTIFICATIONS
// =========================================

export async function getNotifications() {

    const response = await fetch(
        `${API_BASE_URL}/notifications`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to load notifications."
        );
    }

    return data;
}


export async function getUnreadNotificationCount() {

    const response = await fetch(
        `${API_BASE_URL}/notifications/unread-count`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to load notification count."
        );
    }

    return data.count;
}


export async function markNotificationAsRead(id) {

    const response = await fetch(
        `${API_BASE_URL}/notifications/${id}/read`,
        {
            method: "PUT"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to mark notification as read."
        );
    }

    return data;
}


export async function markAllNotificationsAsRead() {

    const response = await fetch(
        `${API_BASE_URL}/notifications/read-all`,
        {
            method: "PUT"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to mark notifications as read."
        );
    }

    return data;
}