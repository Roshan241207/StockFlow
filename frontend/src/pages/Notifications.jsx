import { useEffect, useState } from "react";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/api";


function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    async function loadNotifications() {

        setLoading(true);
        setError("");

        try {

            const data =
                await getNotifications();

            setNotifications(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadNotifications();

    }, []);


    async function handleMarkAsRead(id) {

        try {

            await markNotificationAsRead(id);

            setNotifications(
                notifications.map(
                    (notification) =>
                        notification.id === id
                            ? {
                                ...notification,
                                readStatus: true
                            }
                            : notification
                )
            );

        } catch (error) {

            setError(error.message);
        }
    }


    async function handleMarkAllAsRead() {

        try {

            await markAllNotificationsAsRead();

            setNotifications(
                notifications.map(
                    (notification) => ({
                        ...notification,
                        readStatus: true
                    })
                )
            );

        } catch (error) {

            setError(error.message);
        }
    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }

        return new Date(
            dateValue
        ).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    return (

        <div className="notifications-page">

            <div className="notifications-container">


                {/* HEADER */}

                <div className="notifications-header">

                    <div>

                        <span className="notifications-label">
                            SYSTEM NOTIFICATIONS
                        </span>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with important
                            StockFlow alerts.
                        </p>

                    </div>


                    <div className="notifications-header-actions">

                        <button
                            type="button"
                            className="notification-refresh-button"
                            onClick={loadNotifications}
                        >
                            ↻ Refresh
                        </button>

                        <button
                            type="button"
                            className="notification-read-all-button"
                            onClick={handleMarkAllAsRead}
                        >
                            ✓ Mark All Read
                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="notification-error">

                        {error}

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="notification-empty">

                        Loading notifications...

                    </div>

                ) : notifications.length === 0 ? (

                    <div className="notification-empty">

                        <div className="notification-empty-icon">
                            🔔
                        </div>

                        <h2>
                            No Notifications
                        </h2>

                        <p>
                            You're all caught up.
                        </p>

                    </div>

                ) : (

                    <div className="notification-list">

                        {notifications.map(
                            (notification) => (

                                <div
                                    key={notification.id}
                                    className={
                                        `notification-card ${
                                            notification.readStatus
                                                ? "notification-read"
                                                : "notification-unread"
                                        }`
                                    }
                                >

                                    <div className="notification-icon">

                                        {notification.notificationType ===
                                        "LOW_STOCK"
                                            ? "⚠"
                                            : "🔔"}

                                    </div>


                                    <div className="notification-content">

                                        <div className="notification-title-row">

                                            <h3>
                                                {notification.title}
                                            </h3>

                                            {!notification.readStatus && (

                                                <span className="unread-badge">
                                                    NEW
                                                </span>

                                            )}

                                        </div>


                                        <p>
                                            {notification.message}
                                        </p>


                                        <span className="notification-date">
                                            {formatDate(
                                                notification.createdAt
                                            )}
                                        </span>


                                        {notification.notificationType ===
                                        "LOW_STOCK" && (

                                            <div className="notification-stock-info">

                                                <span>
                                                    Current Stock:
                                                    <strong>
                                                        {" "}
                                                        {notification.currentStock}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Minimum Stock:
                                                    <strong>
                                                        {" "}
                                                        {notification.minimumStock}
                                                    </strong>
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {!notification.readStatus && (

                                        <button
                                            type="button"
                                            className="notification-mark-read"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Mark Read
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}


export default Notifications;