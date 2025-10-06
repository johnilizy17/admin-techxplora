"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { IconBrandGoogle } from "@tabler/icons-react";
import LoginInForm from "@/components/login-form";

export default function Login() {
  const router = useRouter();
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const login = () => {
    // Implement Google OAuth login logic here
    // On success, call GoogleSuccessful with the token response
  }

  const GoogleSuccessful = async (tokenResponse: any) => {
    try {
      setLoading(true);
      // const result = await getGoogleUser(tokenResponse.access_token);

      // const loginData = {
      //   email: result.email.trim().toLowerCase(),
      //   password: result.sub + result.given_name,
      // };

      // await dispatch(authLogin(loginData) as any)
      //   .unwrap()
      //   .then((a: any) => {
      //     if (a.data.accountable_type === "App\\Models\\Student") {
      //       router.push(a.data.is_verified ? ROUTES.option : ROUTES.verify);
      //     } else {
      //       router.push(a.data.is_verified ? ROUTES.dashboard : ROUTES.verify);
      //     }
      //     showToast("Login successful", "success");
      //   });
    } catch (error: any) {
      console.error("Login error:", error);
      // showToast(error?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto relative w-full px-4">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Sign In</h1>
          <p className="text-sm text-gray-500 mt-1">
            You can change your payment credentials here.
          </p>
        </div>

        {/* Google Button */}
        <div className="mt-6">
          <button
            onClick={() => login()}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium rounded-xl border hover:bg-gray-100 h-12 transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            <IconBrandGoogle />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Email Login */}
        <div>
          <h2 className="text-center text-gray-900 font-semibold text-lg mb-3">
            Log in with Email
          </h2>
          <LoginInForm />
        </div>
      </div>
    </div>
  );
}
