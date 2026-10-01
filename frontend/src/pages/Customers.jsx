import { useEffect, useRef, useState } from "react";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/api";


function Customers() {

    // Prevent duplicate submissions
    const submittingRef = useRef(false);


    const emptyForm = {
        customerCode: "",
        customerName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        status: "ACTIVE"
    };


    const [customers, setCustomers] = useState([]);

    const [form, setForm] = useState({ ...emptyForm });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // LOAD CUSTOMERS
    // =========================

    useEffect(() => {
        loadCustomers();
    }, []);


    async function loadCustomers() {

        try {

            setLoading(true);
            setError("");

            const data = await getCustomers();

            setCustomers(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // HANDLE INPUT
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
    // CREATE / UPDATE
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

            // Phone validation
            if (!/^\d{10}$/.test(form.phone.trim())) {

                throw new Error(
                    "Phone number must contain exactly 10 digits."
                );
            }


            // Gmail validation
            if (
                !/^[A-Za-z0-9._%+-]+@gmail\.com$/
                    .test(form.email.trim())
            ) {

                throw new Error(
                    "Please enter a valid Gmail address."
                );
            }


            const customerData = {

                customerCode:
                    form.customerCode.trim(),

                customerName:
                    form.customerName.trim(),

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


            // UPDATE
            if (editingId) {

                await updateCustomer(
                    editingId,
                    customerData
                );

                setSuccess(
                    "Customer updated successfully."
                );

            }

            // CREATE
            else {

                await createCustomer(
                    customerData
                );

                setSuccess(
                    "Customer created successfully."
                );
            }


            resetForm();

            await loadCustomers();


        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

            submittingRef.current = false;
        }
    }


    // =========================
    // EDIT
    // =========================

    function handleEdit(customer) {

        setError("");
        setSuccess("");

        setEditingId(customer.id);


        setForm({

            customerCode:
                customer.customerCode || "",

            customerName:
                customer.customerName || "",

            contactPerson:
                customer.contactPerson || "",

            phone:
                customer.phone || "",

            email:
                customer.email || "",

            address:
                customer.address || "",

            status:
                customer.status || "ACTIVE"
        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =========================
    // DELETE
    // =========================

    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setSuccess("");


            await deleteCustomer(id);


            setSuccess(
                "Customer deleted successfully."
            );


            await loadCustomers();


        } catch (error) {

            setError(error.message);
        }
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="customer-page">

            <div className="customer-container">


                {/* HEADER */}

                <div className="customer-header">

                    <div>

                        <h1>
                            Customer Management
                        </h1>

                        <p>
                            Manage customers for aluminium sales
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

                <div className="customer-form-card">

                    <h2>

                        {editingId
                            ? "Edit Customer"
                            : "Add Customer"
                        }

                    </h2>


                    <form onSubmit={handleSubmit}>


                        <div className="customer-form-grid">


                            {/* CUSTOMER CODE */}

                            <div className="form-group">

                                <label>
                                    Customer Code
                                </label>

                                <input
                                    type="text"
                                    name="customerCode"
                                    value={form.customerCode}
                                    onChange={handleChange}
                                    placeholder="e.g. CUS-001"
                                    required
                                />

                            </div>


                            {/* CUSTOMER NAME */}

                            <div className="form-group">

                                <label>
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="customerName"
                                    value={form.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter customer name"
                                    required
                                />

                            </div>


                            {/* CONTACT PERSON */}

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


                            {/* PHONE */}

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
                                    inputMode="numeric"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

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


                            {/* ADDRESS */}

                            <div className="form-group full-width">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter customer address"
                                    rows="3"
                                />

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "Saving..."

                                    : editingId

                                        ? "Update Customer"

                                        : "Add Customer"

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


                {/* CUSTOMER LIST */}

                <div className="customer-list-card">

                    <h2>
                        Customer List
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading customers...
                        </p>

                    ) : customers.length === 0 ? (

                        <p className="empty-text">
                            No customers found.
                        </p>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Customer Name</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {customers.map(customer => (

                                        <tr key={customer.id}>

                                            <td>
                                                {customer.id}
                                            </td>

                                            <td>
                                                {customer.customerCode}
                                            </td>

                                            <td>
                                                {customer.customerName}
                                            </td>

                                            <td>
                                                {customer.contactPerson}
                                            </td>

                                            <td>
                                                {customer.phone}
                                            </td>

                                            <td>
                                                {customer.email}
                                            </td>

                                            <td>
                                                {customer.address}
                                            </td>

                                            <td>
                                                {customer.status}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(customer)
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
                                                                customer.id
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


export default Customers;