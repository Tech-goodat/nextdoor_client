"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";

const Page = () => {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch(
      "https://nextdoor-server.onrender.com/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user?.business_name) {
      router.push("/my_business/dashboard");
    } else {
      router.push("/client/home");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
  try {
    setLoading(true);

    const response = await fetch(
      "https://nextdoor-server.onrender.com/auth/google/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Google login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user?.business_name) {
      router.push("/my_business/dashboard");
    } else {
      router.push("/client/home");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-orange-50 to-lime-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-800 transition-colors hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>

          <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">
                Next
                <span className="text-orange-500">Door</span>
                <span className="text-lime-600">.</span>
              </h1>

              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Sign in to continue discovering businesses and services within
                your estate.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Mail size={18} className="text-gray-500" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Lock size={18} className="text-gray-500" />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            <div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200" />
  </div>

  <div className="relative flex justify-center">
    <span className="bg-white px-4 text-sm text-gray-500">
      OR
    </span>
  </div>
</div>

<div className="flex justify-center">
 <GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => {
    console.log("Login Failed");
  }}
/>
</div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;