import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {

            setError("Passwords do not match.");
            return;
        }

        const gmailPattern =
            /^[A-Za-z0-9._%+-]+@gmail\.com$/;

        if (!gmailPattern.test(email)) {

            setError(
                "Please enter a valid Gmail address."
            );

            return;
        }

        setLoading(true);

        try {

            await registerUser(
                username,
                email,
                password
            );

            alert(
                "Registration successful. Please login."
            );

            navigate("/login");

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
                    Create Your Account
                </p>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <form onSubmit={handleRegister}>

                    {/* Username */}

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


                    {/* Gmail */}

                    <label htmlFor="email">
                        Gmail Address
                    </label>

                    <input
                        type="email"
                        id="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />


                    {/* Password */}

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
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            {showPassword
                                ? "🙈"
                                : "👁"}
                        </button>

                    </div>


                    {/* Confirm Password */}

                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <div className="password-wrapper">

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            id="confirmPassword"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <button
                            type="button"
                            className="eye-button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        >
                            {showConfirmPassword
                                ? "🙈"
                                : "👁"}
                        </button>

                    </div>


                    {/* Sign Up */}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Sign Up"}
                    </button>

                </form>


                <div className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login here
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;