import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/api";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadCategories();

    }, []);


    async function loadCategories() {

        try {

            setLoading(true);
            setError("");

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            if (editingId === null) {

                await createCategory(
                    name,
                    description
                );

                setSuccess(
                    "Category added successfully."
                );

            } else {

                await updateCategory(
                    editingId,
                    name,
                    description
                );

                setSuccess(
                    "Category updated successfully."
                );
            }

            setName("");
            setDescription("");
            setEditingId(null);

            await loadCategories();

        } catch (error) {

            setError(error.message);

        }
    }


    function handleEdit(category) {

        setEditingId(category.id);
        setName(category.name);
        setDescription(category.description || "");

        setError("");
        setSuccess("");
    }


    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteCategory(id);

            setSuccess(
                "Category deleted successfully."
            );

            await loadCategories();

        } catch (error) {

            setError(error.message);
        }
    }


    function cancelEdit() {

        setEditingId(null);
        setName("");
        setDescription("");

        setError("");
        setSuccess("");
    }


    return (

        <div className="category-page">

            <div className="category-header">

                <div>

                    <h1>Categories</h1>

                    <p>
                        Manage aluminium product categories
                    </p>

                </div>

            </div>


            {error && (

                <div className="category-error">
                    {error}
                </div>

            )}


            {success && (

                <div className="category-success">
                    {success}
                </div>

            )}


            {/* Category Form */}

            <div className="category-card">

                <h2>
                    {editingId === null
                        ? "Add Category"
                        : "Edit Category"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="category-form"
                >

                    <div>

                        <label>
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div>

                        <label>
                            Description
                        </label>

                        <input
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="category-buttons">

                        <button
                            type="submit"
                            className="save-button"
                        >
                            {editingId === null
                                ? "Add Category"
                                : "Update Category"}
                        </button>


                        {editingId !== null && (

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* Category Table */}

            <div className="category-card">

                <h2>Category List</h2>

                {loading ? (

                    <p>Loading categories...</p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {categories.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="no-data"
                                        >
                                            No categories found.
                                        </td>

                                    </tr>

                                ) : (

                                    categories.map(
                                        (category) => (

                                            <tr
                                                key={
                                                    category.id
                                                }
                                            >

                                                <td>
                                                    {category.id}
                                                </td>

                                                <td>
                                                    {category.name}
                                                </td>

                                                <td>
                                                    {
                                                        category.description
                                                    }
                                                </td>

                                                <td>

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Categories;