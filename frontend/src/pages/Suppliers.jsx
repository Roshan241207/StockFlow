import { useEffect, useRef, useState } from "react";

import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "../services/api";


function Suppliers() {

    const submittingRef = useRef(false);


    const emptyForm = {
        supplierCode: "",
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        status: "ACTIVE"
    };


    const [suppliers, setSuppliers] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        loadSuppliers();
    }, []);


    async function loadSuppliers() {

        try {

            setLoading(true);
            setError("");

            const data = await getSuppliers();

            setSuppliers(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    function handleChange(e) {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    }


    function resetForm() {

        setForm({ ...emptyForm });
        setEditingId(null);
    }


    async function handleSubmit(e) {

        e.preventDefault();


        if (submittingRef.current) {
            return;
        }


        submittingRef.current = true;


        setError("");
        setSuccess("");
        setSaving(true);


        try {

            // Frontend validation
            if (!/^\d{10}$/.test(form.phone)) {
                throw new Error(
                    "Phone number must contain exactly 10 digits."
                );
            }


            if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(form.email)) {
                throw new Error(
                    "Please enter a valid Gmail address."
                );
            }


            const supplierData = {

                supplierCode:
                    form.supplierCode.trim(),

                supplierName:
                    form.supplierName.trim(),

                contactPerson:
                    form.contactPerson.trim(),

                phone:
                    form.phone.trim(),

                email:
                    form.email.trim(),

                address:
                    form.address.trim(),

                status:
                    form.status
            };


            if (editingId) {

                await updateSupplier(
                    editingId,
                    supplierData
                );

                setSuccess(
                    "Supplier updated successfully."
                );

            } else {

                await createSupplier(
                    supplierData
                );

                setSuccess(
                    "Supplier created successfully."
                );
            }


            resetForm();

            await loadSuppliers();


        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);
            submittingRef.current = false;
        }
    }


    function handleEdit(supplier) {

        setError("");
        setSuccess("");

        setEditingId(supplier.id);


        setForm({

            supplierCode:
                supplier.supplierCode || "",

            supplierName:
                supplier.supplierName || "",

            contactPerson:
                supplier.contactPerson || "",

            phone:
                supplier.phone || "",

            email:
                supplier.email || "",

            address:
                supplier.address || "",

            status:
                supplier.status || "ACTIVE"
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");


            await deleteSupplier(id);


            setSuccess(
                "Supplier deleted successfully."
            );


            await loadSuppliers();


        } catch (error) {

            setError(error.message);
        }
    }


    return (

        <div className="supplier-page">

            <div className="supplier-container">


                {/* HEADER */}

                <div className="supplier-header">

                    <div>

                        <h1>
                            Supplier Management
                        </h1>

                        <p>
                            Manage aluminium suppliers
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


                {/* FORM */}

                <div className="supplier-form-card">

                    <h2>

                        {editingId
                            ? "Edit Supplier"
                            : "Add Supplier"
                        }

                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="supplier-form-grid">


                            <div className="form-group">

                                <label>
                                    Supplier Code
                                </label>

                                <input
                                    type="text"
                                    name="supplierCode"
                                    value={form.supplierCode}
                                    onChange={handleChange}
                                    placeholder="e.g. SUP-001"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Supplier Name
                                </label>

                                <input
                                    type="text"
                                    name="supplierName"
                                    value={form.supplierName}
                                    onChange={handleChange}
                                    placeholder="Enter supplier name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Contact Person
                                </label>

                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={form.contactPerson}
                                    onChange={handleChange}
                                    placeholder="Contact person"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone number"
                                    maxLength="10"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Gmail
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    required
                                />

                            </div>


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


                            <div className="form-group full-width">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter supplier address"
                                    rows="3"
                                />

                            </div>


                        </div>


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

                                        ? "Update Supplier"

                                        : "Add Supplier"

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


                {/* SUPPLIER LIST */}

                <div className="supplier-list-card">

                    <h2>
                        Supplier List
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading suppliers...
                        </p>

                    ) : suppliers.length === 0 ? (

                        <p className="empty-text">
                            No suppliers found.
                        </p>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Supplier Name</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {suppliers.map(supplier => (

                                        <tr key={supplier.id}>

                                            <td>
                                                {supplier.id}
                                            </td>

                                            <td>
                                                {supplier.supplierCode}
                                            </td>

                                            <td>
                                                {supplier.supplierName}
                                            </td>

                                            <td>
                                                {supplier.contactPerson}
                                            </td>

                                            <td>
                                                {supplier.phone}
                                            </td>

                                            <td>
                                                {supplier.email}
                                            </td>

                                            <td>
                                                {supplier.address}
                                            </td>

                                            <td>
                                                {supplier.status}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(supplier)
                                                        }
                                                        disabled={saving}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                supplier.id
                                                            )
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


export default Suppliers;