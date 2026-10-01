import { useEffect, useRef, useState } from "react";

import {
    getProducts,
    getSuppliers,
    getPurchases,
    createPurchase
} from "../services/api";


function Purchases() {

    // Prevent duplicate purchase submissions
    const submittingRef = useRef(false);


    // =========================
    // FORM DEFAULT
    // =========================

    const emptyItem = {
        productId: "",
        quantity: "",
        rate: ""
    };


    // =========================
    // STATE
    // =========================

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [purchaseNumber, setPurchaseNumber] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [supplierId, setSupplierId] = useState("");

    const [items, setItems] = useState([
        { ...emptyItem }
    ]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        loadData();
    }, []);


    async function loadData() {

        setLoading(true);
        setError("");

        const errors = [];


        // =========================
        // LOAD PRODUCTS
        // =========================

        try {

            const productData = await getProducts();

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );

        } catch (error) {

            console.error(
                "Products API error:",
                error
            );

            errors.push(
                `Products: ${error.message}`
            );

            setProducts([]);
        }


        // =========================
        // LOAD SUPPLIERS
        // =========================

        try {

            const supplierData = await getSuppliers();

            setSuppliers(
                Array.isArray(supplierData)
                    ? supplierData
                    : []
            );

        } catch (error) {

            console.error(
                "Suppliers API error:",
                error
            );

            errors.push(
                `Suppliers: ${error.message}`
            );

            setSuppliers([]);
        }


        // =========================
        // LOAD PURCHASES
        // =========================

        try {

            const purchaseData = await getPurchases();

            setPurchases(
                Array.isArray(purchaseData)
                    ? purchaseData
                    : []
            );

        } catch (error) {

            console.error(
                "Purchases API error:",
                error
            );

            errors.push(
                `Purchases: ${error.message}`
            );

            setPurchases([]);
        }


        // =========================
        // SHOW ERRORS
        // =========================

        if (errors.length > 0) {

            setError(
                errors.join(" | ")
            );
        }


        setLoading(false);
    }


    // =========================
    // ITEM CHANGE
    // =========================

    function handleItemChange(
        index,
        field,
        value
    ) {

        setItems(previousItems => {

            const updatedItems = [
                ...previousItems
            ];

            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };

            return updatedItems;
        });
    }


    // =========================
    // ADD ITEM
    // =========================

    function addItem() {

        setItems(previousItems => [
            ...previousItems,
            { ...emptyItem }
        ]);
    }


    // =========================
    // REMOVE ITEM
    // =========================

    function removeItem(index) {

        setItems(previousItems => {

            if (previousItems.length === 1) {
                return previousItems;
            }

            return previousItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            );
        });
    }


    // =========================
    // ITEM TOTAL
    // =========================

    function getItemTotal(item) {

        const quantity =
            Number(item.quantity) || 0;

        const rate =
            Number(item.rate) || 0;

        return quantity * rate;
    }


    // =========================
    // PURCHASE TOTAL
    // =========================

    function getPurchaseTotal() {

        return items.reduce(
            (total, item) => {

                return (
                    total +
                    getItemTotal(item)
                );

            },
            0
        );
    }


    // =========================
    // RESET FORM
    // =========================

    function resetForm() {

        setPurchaseNumber("");
        setPurchaseDate("");
        setSupplierId("");

        setItems([
            { ...emptyItem }
        ]);
    }


    // =========================
    // CREATE PURCHASE
    // =========================

    async function handleSubmit(e) {

        e.preventDefault();


        // Prevent duplicate submit
        if (submittingRef.current) {
            return;
        }


        submittingRef.current = true;

        setError("");
        setSuccess("");
        setSaving(true);


        try {

            // =========================
            // BASIC VALIDATION
            // =========================

            if (!purchaseNumber.trim()) {

                throw new Error(
                    "Purchase number is required."
                );
            }


            if (!purchaseDate) {

                throw new Error(
                    "Purchase date is required."
                );
            }


            if (!supplierId) {

                throw new Error(
                    "Please select a supplier."
                );
            }


            if (items.length === 0) {

                throw new Error(
                    "At least one purchase item is required."
                );
            }


            // =========================
            // VALIDATE ITEMS
            // =========================

            const purchaseItems =
                items.map(
                    (item, index) => {

                        if (!item.productId) {

                            throw new Error(
                                `Please select a product for item ${index + 1}.`
                            );
                        }


                        const quantity =
                            Number(item.quantity);

                        const rate =
                            Number(item.rate);


                        if (
                            Number.isNaN(quantity) ||
                            quantity <= 0
                        ) {

                            throw new Error(
                                `Quantity must be greater than zero for item ${index + 1}.`
                            );
                        }


                        if (
                            Number.isNaN(rate) ||
                            rate < 0
                        ) {

                            throw new Error(
                                `Rate cannot be negative for item ${index + 1}.`
                            );
                        }


                        return {

                            productId:
                                Number(
                                    item.productId
                                ),

                            quantity:
                                quantity,

                            rate:
                                rate
                        };
                    }
                );


            // =========================
            // REQUEST DATA
            // =========================

            const purchaseData = {

                purchaseNumber:
                    purchaseNumber.trim(),

                purchaseDate:
                    purchaseDate,

                supplierId:
                    Number(supplierId),

                items:
                    purchaseItems
            };


            console.log(
                "Sending purchase:",
                purchaseData
            );


            // =========================
            // SAVE PURCHASE
            // =========================

            await createPurchase(
                purchaseData
            );


            // =========================
            // SUCCESS
            // =========================

            setSuccess(
                "Purchase created successfully. Stock has been increased."
            );


            resetForm();


            // Reload data
            await loadData();


        } catch (error) {

            console.error(
                "Purchase submit error:",
                error
            );

            setError(
                error.message ||
                "Failed to create purchase."
            );

        } finally {

            setSaving(false);

            submittingRef.current = false;
        }
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="purchase-page">

            <div className="purchase-container">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="purchase-header">

                    <div>

                        <h1>
                            Purchase / Stock In
                        </h1>

                        <p>
                            Record purchases and increase product stock
                        </p>

                    </div>

                </div>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* =========================
                    SUCCESS
                ========================= */}

                {success && (

                    <div className="success-message">
                        {success}
                    </div>

                )}


                {/* =========================
                    FORM
                ========================= */}

                <div className="purchase-form-card">

                    <h2>
                        Add Purchase
                    </h2>


                    <form onSubmit={handleSubmit}>


                        {/* =========================
                            BASIC DETAILS
                        ========================= */}

                        <div className="purchase-basic-grid">


                            {/* PURCHASE NUMBER */}

                            <div className="form-group">

                                <label>
                                    Purchase Number
                                </label>

                                <input
                                    type="text"
                                    value={purchaseNumber}
                                    onChange={(e) =>
                                        setPurchaseNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. PUR-001"
                                    disabled={saving}
                                    required
                                />

                            </div>


                            {/* PURCHASE DATE */}

                            <div className="form-group">

                                <label>
                                    Purchase Date
                                </label>

                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) =>
                                        setPurchaseDate(
                                            e.target.value
                                        )
                                    }
                                    disabled={saving}
                                    required
                                />

                            </div>


                            {/* SUPPLIER */}

                            <div className="form-group">

                                <label>
                                    Supplier
                                </label>

                                <select
                                    value={supplierId}
                                    onChange={(e) =>
                                        setSupplierId(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        saving ||
                                        loading
                                    }
                                    required
                                >

                                    <option value="">
                                        {loading
                                            ? "Loading suppliers..."
                                            : suppliers.length === 0
                                                ? "No suppliers found"
                                                : "Select Supplier"
                                        }
                                    </option>


                                    {suppliers.map(
                                        supplier => (

                                            <option
                                                key={
                                                    supplier.id
                                                }
                                                value={
                                                    supplier.id
                                                }
                                            >
                                                {
                                                    supplier.supplierName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* =========================
                            ITEMS
                        ========================= */}

                        <div className="purchase-items-section">


                            <div className="purchase-items-header">

                                <h3>
                                    Purchase Items
                                </h3>


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={addItem}
                                    disabled={saving}
                                >
                                    + Add Item
                                </button>

                            </div>


                            <div className="purchase-items-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Rate
                                            </th>

                                            <th>
                                                Total
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {items.map(
                                            (item, index) => (

                                                <tr
                                                    key={index}
                                                >

                                                    {/* PRODUCT */}

                                                    <td>

                                                        <select
                                                            value={
                                                                item.productId
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "productId",
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                saving ||
                                                                loading
                                                            }
                                                        >

                                                            <option value="">

                                                                {loading
                                                                    ? "Loading products..."
                                                                    : products.length === 0
                                                                        ? "No products found"
                                                                        : "Select Product"
                                                                }

                                                            </option>


                                                            {products.map(
                                                                product => (

                                                                    <option
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        value={
                                                                            product.id
                                                                        }
                                                                    >

                                                                        {
                                                                            product.productName
                                                                        }

                                                                        {" ("}

                                                                        {
                                                                            product.productCode
                                                                        }

                                                                        {")"}

                                                                    </option>

                                                                )
                                                            )}

                                                        </select>

                                                    </td>


                                                    {/* QUANTITY */}

                                                    <td>

                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "quantity",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Quantity"
                                                            disabled={
                                                                saving
                                                            }
                                                        />

                                                    </td>


                                                    {/* RATE */}

                                                    <td>

                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={
                                                                item.rate
                                                            }
                                                            onChange={(e) =>
                                                                handleItemChange(
                                                                    index,
                                                                    "rate",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Rate"
                                                            disabled={
                                                                saving
                                                            }
                                                        />

                                                    </td>


                                                    {/* TOTAL */}

                                                    <td>

                                                        ₹
                                                        {
                                                            getItemTotal(
                                                                item
                                                            ).toFixed(2)
                                                        }

                                                    </td>


                                                    {/* REMOVE */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                saving ||
                                                                items.length === 1
                                                            }
                                                        >
                                                            Remove
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =========================
                            TOTAL
                        ========================= */}

                        <div className="purchase-total">

                            <span>
                                Purchase Total:
                            </span>

                            <strong>
                                ₹
                                {
                                    getPurchaseTotal()
                                        .toFixed(2)
                                }
                            </strong>

                        </div>


                        {/* =========================
                            BUTTONS
                        ========================= */}

                        <div className="form-buttons">


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={
                                    saving ||
                                    submittingRef.current
                                }
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Purchase"
                                }

                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>


                {/* =========================
                    PURCHASE HISTORY
                ========================= */}

                <div className="purchase-list-card">

                    <h2>
                        Purchase History
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading purchases...
                        </p>

                    ) : purchases.length === 0 ? (

                        <p className="empty-text">
                            No purchases found.
                        </p>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Purchase Number
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Supplier
                                        </th>

                                        <th>
                                            Total Amount
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {purchases.map(
                                        purchase => (

                                            <tr
                                                key={
                                                    purchase.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        purchase.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        purchase.purchaseNumber
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        purchase.purchaseDate
                                                    }
                                                </td>

                                                <td>

                                                    {purchase.supplier
                                                        ? purchase
                                                            .supplier
                                                            .supplierName
                                                        : "-"
                                                    }

                                                </td>

                                                <td>

                                                    ₹
                                                    {
                                                        Number(
                                                            purchase.totalAmount || 0
                                                        ).toFixed(2)
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}


export default Purchases;