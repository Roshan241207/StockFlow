import { useEffect, useRef, useState } from "react";

import {
    getProducts,
    getCustomers,
    getSales,
    createSale
} from "../services/api";


function Sales() {

    // Prevent duplicate sale submission
    const submittingRef = useRef(false);


    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);


    const [saleNumber, setSaleNumber] = useState("");
    const [saleDate, setSaleDate] = useState("");
    const [customerId, setCustomerId] = useState("");


    const [items, setItems] = useState([
        {
            productId: "",
            quantity: "",
            rate: ""
        }
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

        try {

            setLoading(true);
            setError("");

            const [
                productData,
                customerData,
                saleData
            ] = await Promise.all([
                getProducts(),
                getCustomers(),
                getSales()
            ]);


            setProducts(productData);
            setCustomers(customerData);
            setSales(saleData);


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // ITEM CHANGE
    // =========================

    function handleItemChange(index, field, value) {

        const updatedItems = [...items];

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        setItems(updatedItems);
    }


    // =========================
    // ADD ITEM
    // =========================

    function addItem() {

        setItems([
            ...items,
            {
                productId: "",
                quantity: "",
                rate: ""
            }
        ]);
    }


    // =========================
    // REMOVE ITEM
    // =========================

    function removeItem(index) {

        if (items.length === 1) {
            return;
        }

        const updatedItems = items.filter(
            (_, itemIndex) => itemIndex !== index
        );

        setItems(updatedItems);
    }


    // =========================
    // GET SELECTED PRODUCT
    // =========================

    function getSelectedProduct(productId) {

        return products.find(
            product =>
                product.id === Number(productId)
        );
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
    // SALE TOTAL
    // =========================

    function getSaleTotal() {

        return items.reduce(
            (total, item) =>
                total + getItemTotal(item),
            0
        );
    }


    // =========================
    // RESET FORM
    // =========================

    function resetForm() {

        setSaleNumber("");
        setSaleDate("");
        setCustomerId("");

        setItems([
            {
                productId: "",
                quantity: "",
                rate: ""
            }
        ]);
    }


    // =========================
    // CREATE SALE
    // =========================

    async function handleSubmit(e) {

        e.preventDefault();


        // Prevent duplicate submission
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

            if (!saleNumber.trim()) {

                throw new Error(
                    "Sale number is required."
                );
            }


            if (!saleDate) {

                throw new Error(
                    "Sale date is required."
                );
            }


            if (!customerId) {

                throw new Error(
                    "Please select a customer."
                );
            }


            if (items.length === 0) {

                throw new Error(
                    "At least one sale item is required."
                );
            }


            // =========================
            // VALIDATE ITEMS
            // =========================

            const saleItems = items.map(
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


                    if (!quantity || quantity <= 0) {

                        throw new Error(
                            `Quantity must be greater than zero for item ${index + 1}.`
                        );
                    }


                    if (rate < 0 || Number.isNaN(rate)) {

                        throw new Error(
                            `Rate cannot be negative for item ${index + 1}.`
                        );
                    }


                    return {

                        productId:
                            Number(item.productId),

                        quantity:
                            quantity,

                        rate:
                            rate
                    };
                }
            );


            // =========================
            // CREATE REQUEST
            // =========================

            const saleData = {

                saleNumber:
                    saleNumber.trim(),

                saleDate:
                    saleDate,

                customerId:
                    Number(customerId),

                items:
                    saleItems
            };


            // =========================
            // SAVE SALE
            // =========================

            await createSale(saleData);


            setSuccess(
                "Sale created successfully. Stock has been decreased."
            );


            resetForm();


            // Reload sales and products
            await loadData();


        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

            submittingRef.current = false;
        }
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="sale-page">

            <div className="sale-container">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="sale-header">

                    <div>

                        <h1>
                            Sales / Stock Out
                        </h1>

                        <p>
                            Record sales and decrease product stock
                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="success-message">
                        {success}
                    </div>

                )}


                {/* =========================
                    SALE FORM
                ========================= */}

                <div className="sale-form-card">

                    <h2>
                        Add Sale
                    </h2>


                    <form onSubmit={handleSubmit}>


                        {/* =========================
                            BASIC DETAILS
                        ========================= */}

                        <div className="sale-basic-grid">


                            <div className="form-group">

                                <label>
                                    Sale Number
                                </label>

                                <input
                                    type="text"
                                    value={saleNumber}
                                    onChange={(e) =>
                                        setSaleNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. SALE-001"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Sale Date
                                </label>

                                <input
                                    type="date"
                                    value={saleDate}
                                    onChange={(e) =>
                                        setSaleDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Customer
                                </label>

                                <select
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Customer
                                    </option>


                                    {customers.map(
                                        customer => (

                                            <option
                                                key={
                                                    customer.id
                                                }
                                                value={
                                                    customer.id
                                                }
                                            >
                                                {
                                                    customer.customerName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* =========================
                            SALE ITEMS
                        ========================= */}

                        <div className="sale-items-section">

                            <div className="sale-items-header">

                                <h3>
                                    Sale Items
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


                            <div className="sale-items-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Available Stock
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
                                            (item, index) => {

                                                const selectedProduct =
                                                    getSelectedProduct(
                                                        item.productId
                                                    );


                                                return (

                                                    <tr key={index}>

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
                                                                    saving
                                                                }
                                                            >

                                                                <option value="">
                                                                    Select Product
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
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                                product.productCode
                                                                            }
                                                                            )

                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>

                                                        </td>


                                                        <td>

                                                            <span className="stock-display">

                                                                {
                                                                    selectedProduct
                                                                        ? selectedProduct.currentStock
                                                                        : "-"
                                                                }

                                                            </span>

                                                        </td>


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


                                                        <td>

                                                            ₹
                                                            {
                                                                getItemTotal(
                                                                    item
                                                                ).toFixed(2)
                                                            }

                                                        </td>


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

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =========================
                            SALE TOTAL
                        ========================= */}

                        <div className="sale-total">

                            <span>
                                Sale Total:
                            </span>

                            <strong>
                                ₹
                                {
                                    getSaleTotal()
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
                                    : "Save Sale"
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
                    SALES HISTORY
                ========================= */}

                <div className="sale-list-card">

                    <h2>
                        Sales History
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading sales...
                        </p>

                    ) : sales.length === 0 ? (

                        <p className="empty-text">
                            No sales found.
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
                                            Sale Number
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Total Amount
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {sales.map(
                                        sale => (

                                            <tr
                                                key={
                                                    sale.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        sale.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        sale.saleNumber
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        sale.saleDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        sale.customer
                                                            ? sale
                                                                  .customer
                                                                  .customerName
                                                            : "-"
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {
                                                        Number(
                                                            sale.totalAmount || 0
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


export default Sales;