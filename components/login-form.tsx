"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
import { IconZoomExclamationFilled } from "@tabler/icons-react";

export default function LoginInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // const dispatch = useDispatch();
    const router = useRouter();
    const showToast = () => {
        // Implement your toast notification logic here
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/dashboard';
        if (!email || !password) {
            // showToast("Please fill in all fields", "error");
            return;
        }

        try {
            setSubmitting(true);
            const loginData = {
                email: email.trim().toLowerCase(),
                password,
            };

            // const result = await dispatch(authLogin(loginData) as any).unwrap();

            // const isStudent = result.data.accountable_type === "App\\Models\\Student";
            // const isVerified = result.data.is_verified === 1;

            // if (isStudent) {
            //     router.push(isVerified ? ROUTES.option : ROUTES.verify);
            // } else {
            //     router.push(isVerified ? ROUTES.dashboard : ROUTES.verify);
            // }

            // showToast("Login successful", "success");
        } catch (error: any) {
            console.error("Login failed:", error);
            // showToast(error?.message || "Login failed", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center mt-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-3xl px-6 py-8 space-y-6"
            >
                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <IconZoomExclamationFilled />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="elementary221b@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            style={{ color: "#000" }}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        style={{ color: "#000" }}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full flex items-center justify-center gap-2 text-white font-medium rounded-full h-12 transition-all ${submitting
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {submitting ? (
                            <span className="animate-pulse">Logging in...</span>
                        ) : (
                            <>
                                <span>Log In</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
