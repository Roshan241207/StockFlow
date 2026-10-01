import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetForgotPassword
} from "../services/api";


function ForgotPassword() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // SEND OTP
    // =========================

    async function handleSendOtp(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await sendForgotPasswordOtp(
                email.trim()
            );

            setSuccess(
                "OTP sent successfully to your Gmail."
            );

            setStep(2);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // VERIFY OTP
    // =========================

    async function handleVerifyOtp(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await verifyForgotPasswordOtp(
                email.trim(),
                otp.trim()
            );

            setSuccess(
                "OTP verified successfully."
            );

            setStep(3);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    // =========================
    // RESET PASSWORD
    // =========================

    async function handleResetPassword(e) {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (newPassword.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        setLoading(true);


        try {

            await resetForgotPassword(
                email.trim(),
                otp.trim(),
                newPassword
            );


            setSuccess(
                "Password reset successfully. Redirecting to login..."
            );


            setTimeout(() => {
                navigate("/login");
            }, 1500);


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    StockFlow
                </h1>

                <p className="auth-subtitle">
                    Reset your password
                </p>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}


                {/* =========================
                    STEP 1
                ========================= */}

                {step === 1 && (

                    <form onSubmit={handleSendOtp}>

                        <label htmlFor="email">
                            Gmail Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your Gmail address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending OTP..."
                                : "Send OTP"
                            }
                        </button>

                    </form>

                )}


                {/* =========================
                    STEP 2
                ========================= */}

                {step === 2 && (

                    <form onSubmit={handleVerifyOtp}>

                        <label htmlFor="otp">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            maxLength="6"
                            inputMode="numeric"
                            required
                        />


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }
                        </button>


                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setError("");
                                setSuccess("");
                            }}
                            disabled={loading}
                        >
                            Change Gmail
                        </button>

                    </form>

                )}


                {/* =========================
                    STEP 3
                ========================= */}

                {step === 3 && (

                    <form onSubmit={handleResetPassword}>

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            required
                        />


                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"
                            }
                        </button>

                    </form>

                )}


                <div className="auth-footer">

                    Remember your password?{" "}

                    <Link to="/login">
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
}


export default ForgotPassword;