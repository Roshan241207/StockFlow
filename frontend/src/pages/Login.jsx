import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await loginUser(username, password);

            localStorage.setItem(
                "stockflowUser",
                JSON.stringify(data)
            );

           if (data.role === "ADMIN") {
    navigate("/admin");
} else {
    navigate("/");
}

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>StockFlow</h1>

                <p className="auth-subtitle">
                    Aluminium Inventory Management System
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="password-wrapper">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="eye-button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>

                    </div>

                    <div className="forgot-password">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <div className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Sign up here
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;