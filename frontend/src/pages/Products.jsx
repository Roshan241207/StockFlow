import { useEffect, useRef, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
} from "../services/api";


function Products() {

    // Prevent duplicate form submissions
    const submittingRef = useRef(false);


    const emptyForm = {
        productCode: "",
        productName: "",
        materialType: "",
        alloyGrade: "",
        length: "",
        width: "",
        thickness: "",
        unit: "",
        weightPerUnit: "",
        currentStock: 0,
        minimumStock: "",
        purchasePrice: "",
        sellingPrice: "",
        warehouseLocation: "",
        status: "ACTIVE",
        categoryId: ""
    };


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // LOAD PRODUCTS + CATEGORIES
    // =========================

    useEffect(() => {
        loadData();
    }, []);


    async function loadData() {

        try {

            setLoading(true);
            setError("");

            const [productData, categoryData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            setProducts(productData);
            setCategories(categoryData);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // INPUT CHANGE
    // =========================

    function handleChange(e) {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    }


    // =========================
    // RESET FORM
    // =========================

    function resetForm() {

        setForm({ ...emptyForm });
        setEditingId(null);
    }


    // =========================
    // CREATE / UPDATE PRODUCT
    // =========================

    async function handleSubmit(e) {

        e.preventDefault();


        // Prevent duplicate submissions
        if (submittingRef.current) {
            return;
        }


        submittingRef.current = true;


        setError("");
        setSuccess("");
        setSaving(true);


        try {

            // Check category
            if (!form.categoryId) {
                throw new Error("Please select a category.");
            }


            // Prepare product data
            const productData = {

                productCode: form.productCode.trim(),

                productName: form.productName.trim(),

                materialType: form.materialType.trim(),

                alloyGrade: form.alloyGrade.trim(),


                length: form.length
                    ? Number(form.length)
                    : null,


                width: form.width
                    ? Number(form.width)
                    : null,


                thickness: form.thickness
                    ? Number(form.thickness)
                    : null,


                unit: form.unit.trim(),


                weightPerUnit: form.weightPerUnit
                    ? Number(form.weightPerUnit)
                    : null,


                currentStock: form.currentStock
                    ? Number(form.currentStock)
                    : 0,


                minimumStock: form.minimumStock
                    ? Number(form.minimumStock)
                    : 0,


                purchasePrice: form.purchasePrice
                    ? Number(form.purchasePrice)
                    : 0,


                sellingPrice: form.sellingPrice
                    ? Number(form.sellingPrice)
                    : 0,


                warehouseLocation:
                    form.warehouseLocation.trim(),


                status: form.status,


                category: {
                    id: Number(form.categoryId)
                }
            };


            // UPDATE
            if (editingId) {

                await updateProduct(
                    editingId,
                    productData
                );

                setSuccess(
                    "Product updated successfully."
                );

            }

            // CREATE
            else {

                await createProduct(productData);

                setSuccess(
                    "Product created successfully."
                );
            }


            // Clear form
            resetForm();


            // Reload product list
            await loadData();


        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

            // Allow another submission
            submittingRef.current = false;
        }
    }


    // =========================
    // EDIT PRODUCT
    // =========================

    function handleEdit(product) {

        setError("");
        setSuccess("");

        setEditingId(product.id);


        setForm({

            productCode:
                product.productCode || "",

            productName:
                product.productName || "",

            materialType:
                product.materialType || "",

            alloyGrade:
                product.alloyGrade || "",


            length:
                product.length ?? "",

            width:
                product.width ?? "",

            thickness:
                product.thickness ?? "",


            unit:
                product.unit || "",

            weightPerUnit:
                product.weightPerUnit ?? "",


            currentStock:
                product.currentStock ?? 0,

            minimumStock:
                product.minimumStock ?? "",


            purchasePrice:
                product.purchasePrice ?? "",

            sellingPrice:
                product.sellingPrice ?? "",


            warehouseLocation:
                product.warehouseLocation || "",

            status:
                product.status || "ACTIVE",


            categoryId:
                product.category
                    ? product.category.id
                    : ""
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =========================
    // DELETE PRODUCT
    // =========================

    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");


            await deleteProduct(id);


            setSuccess(
                "Product deleted successfully."
            );


            await loadData();


        } catch (error) {

            setError(error.message);
        }
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="product-page">

            <div className="product-container">


                {/* HEADER */}

                <div className="product-header">

                    <div>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Manage aluminium products and stock details
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


                {/* FORM CARD */}

                <div className="product-form-card">

                    <h2>

                        {editingId
                            ? "Edit Product"
                            : "Add Product"
                        }

                    </h2>


                    <form onSubmit={handleSubmit}>


                        <div className="form-grid">


                            {/* PRODUCT CODE */}

                            <div className="form-group">

                                <label>
                                    Product Code
                                </label>

                                <input
                                    type="text"
                                    name="productCode"
                                    value={form.productCode}
                                    onChange={handleChange}
                                    placeholder="e.g. AL-001"
                                    required
                                />

                            </div>


                            {/* PRODUCT NAME */}

                            <div className="form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={form.productName}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>


                                    {categories.map(category => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* MATERIAL TYPE */}

                            <div className="form-group">

                                <label>
                                    Material Type
                                </label>

                                <input
                                    type="text"
                                    name="materialType"
                                    value={form.materialType}
                                    onChange={handleChange}
                                    placeholder="Sheet / Plate / Rod"
                                    required
                                />

                            </div>


                            {/* ALLOY GRADE */}

                            <div className="form-group">

                                <label>
                                    Alloy Grade
                                </label>

                                <input
                                    type="text"
                                    name="alloyGrade"
                                    value={form.alloyGrade}
                                    onChange={handleChange}
                                    placeholder="6061 / 6063"
                                    required
                                />

                            </div>


                            {/* LENGTH */}

                            <div className="form-group">

                                <label>
                                    Length
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="length"
                                    value={form.length}
                                    onChange={handleChange}
                                    placeholder="Length"
                                />

                            </div>


                            {/* WIDTH */}

                            <div className="form-group">

                                <label>
                                    Width
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="width"
                                    value={form.width}
                                    onChange={handleChange}
                                    placeholder="Width"
                                />

                            </div>


                            {/* THICKNESS */}

                            <div className="form-group">

                                <label>
                                    Thickness
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="thickness"
                                    value={form.thickness}
                                    onChange={handleChange}
                                    placeholder="Thickness"
                                />

                            </div>


                            {/* UNIT */}

                            <div className="form-group">

                                <label>
                                    Unit
                                </label>

                                <input
                                    type="text"
                                    name="unit"
                                    value={form.unit}
                                    onChange={handleChange}
                                    placeholder="kg / piece"
                                    required
                                />

                            </div>


                            {/* WEIGHT */}

                            <div className="form-group">

                                <label>
                                    Weight Per Unit
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="weightPerUnit"
                                    value={form.weightPerUnit}
                                    onChange={handleChange}
                                    placeholder="Weight"
                                />

                            </div>


                            {/* CURRENT STOCK */}

                            <div className="form-group">

                                <label>
                                    Current Stock
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="currentStock"
                                    value={form.currentStock}
                                    onChange={handleChange}
                                    min="0"
                                />

                            </div>


                            {/* MINIMUM STOCK */}

                            <div className="form-group">

                                <label>
                                    Minimum Stock
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="minimumStock"
                                    value={form.minimumStock}
                                    onChange={handleChange}
                                    min="0"
                                />

                            </div>


                            {/* PURCHASE PRICE */}

                            <div className="form-group">

                                <label>
                                    Purchase Price
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="purchasePrice"
                                    value={form.purchasePrice}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* SELLING PRICE */}

                            <div className="form-group">

                                <label>
                                    Selling Price
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="sellingPrice"
                                    value={form.sellingPrice}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>


                            {/* WAREHOUSE */}

                            <div className="form-group">

                                <label>
                                    Warehouse Location
                                </label>

                                <input
                                    type="text"
                                    name="warehouseLocation"
                                    value={form.warehouseLocation}
                                    onChange={handleChange}
                                    placeholder="e.g. Warehouse A"
                                />

                            </div>


                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >

                                    <option value="ACTIVE">
                                        ACTIVE
                                    </option>

                                    <option value="INACTIVE">
                                        INACTIVE
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* FORM BUTTONS */}

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

                                    : editingId

                                        ? "Update Product"

                                        : "Add Product"

                                }

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={resetForm}
                                    disabled={saving}
                                >

                                    Cancel

                                </button>

                            )}

                        </div>


                    </form>

                </div>


                {/* PRODUCT LIST */}

                <div className="product-list-card">

                    <h2>
                        Product List
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading products...
                        </p>

                    ) : products.length === 0 ? (

                        <p className="empty-text">
                            No products found.
                        </p>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Material</th>
                                        <th>Alloy</th>
                                        <th>Stock</th>
                                        <th>Min Stock</th>
                                        <th>Purchase Price</th>
                                        <th>Selling Price</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {products.map(product => (

                                        <tr key={product.id}>


                                            <td>
                                                {product.id}
                                            </td>


                                            <td>
                                                {product.productCode}
                                            </td>


                                            <td>
                                                {product.productName}
                                            </td>


                                            <td>
                                                {product.category
                                                    ? product.category.name
                                                    : "-"
                                                }
                                            </td>


                                            <td>
                                                {product.materialType}
                                            </td>


                                            <td>
                                                {product.alloyGrade}
                                            </td>


                                            <td>
                                                {product.currentStock}
                                            </td>


                                            <td>
                                                {product.minimumStock}
                                            </td>


                                            <td>
                                                ₹{product.purchasePrice}
                                            </td>


                                            <td>
                                                ₹{product.sellingPrice}
                                            </td>


                                            <td>
                                                {product.warehouseLocation}
                                            </td>


                                            <td>
                                                {product.status}
                                            </td>


                                            <td>

                                                <div className="action-buttons">


                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                        disabled={saving}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(product.id)
                                                        }
                                                        disabled={saving}
                                                    >
                                                        Delete
                                                    </button>


                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}


export default Products;