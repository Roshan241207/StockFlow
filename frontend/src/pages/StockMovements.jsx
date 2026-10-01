import { useEffect, useState } from "react";

import {
    getStockMovements
} from "../services/api";


function StockMovements() {

    const [movements, setMovements] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD MOVEMENTS
    // =========================

    useEffect(() => {

        loadMovements();

    }, []);


    async function loadMovements() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getStockMovements();

            setMovements(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // FORMAT DATE
    // =========================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString();
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="movement-page">

            <div className="movement-container">


                {/* HEADER */}

                <div className="movement-header">

                    <div>

                        <h1>
                            Stock Movement History
                        </h1>

                        <p>
                            Track all stock-in and stock-out activities
                        </p>

                    </div>


                    <button
                        type="button"
                        className="secondary-button"
                        onClick={loadMovements}
                        disabled={loading}
                    >
                        Refresh
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* MOVEMENT CARD */}

                <div className="movement-list-card">

                    <h2>
                        Movement History
                    </h2>


                    {loading ? (

                        <p className="loading-text">
                            Loading stock movements...
                        </p>

                    ) : movements.length === 0 ? (

                        <p className="empty-text">
                            No stock movements found.
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
                                            Product
                                        </th>

                                        <th>
                                            Movement Type
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                        <th>
                                            Stock After
                                        </th>

                                        <th>
                                            Reason
                                        </th>

                                        <th>
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {movements.map(
                                        movement => (

                                            <tr
                                                key={
                                                    movement.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        movement.id
                                                    }
                                                </td>


                                                <td>

                                                    {movement.product
                                                        ? movement
                                                              .product
                                                              .productName
                                                        : "-"
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            movement
                                                                .movementType
                                                                ?.toUpperCase() ===
                                                            "PURCHASE"
                                                                ? "movement-purchase"
                                                                : "movement-sale"
                                                        }
                                                    >
                                                        {
                                                            movement
                                                                .movementType
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        movement.quantity
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        movement.stockAfter
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        movement.reason
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            movement.movementDate
                                                        )
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


export default StockMovements;