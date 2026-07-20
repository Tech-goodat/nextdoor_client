"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Lock,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://nextdoor-server.onrender.com/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            phone_number: phoneNumber,
            email,
            house_number: houseNumber,
            password,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-orange-50 to-lime-50">
      
      {/* Success Alert */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-bounce sm:top-6 sm:right-6">
          <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-orange-100 bg-white/90 backdrop-blur-md px-5 py-4 shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-orange-100 to-lime-100">
              <CheckCircle2
                size={22}
                className="text-lime-600"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                🎉 Welcome to NextDoor
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Your account has been created successfully.
                Redirecting...
              </p>
            </div>

            <button
              onClick={() => setSuccess(false)}
              className="text-gray-400 transition hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-3xl">
          {/* Return Home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-800 transition-colors hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>

          {/* Card */}
          <div className="rounded-3xl  border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">
                Next
                <span className="text-orange-500">Door</span>
                <span className="text-lime-600">.</span>
              </h1>

              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Join as a Resident
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Start discovering estate businesses and
                services near you.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  First Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <User
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    placeholder="Felix"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
               <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Last Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <User
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    placeholder="Kiprotich"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Phone Number
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Phone
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value)
                    }
                    placeholder="0712 345 678"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Mail
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="felix@example.com"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* House Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Your House / Unit
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Home
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="text"
                    required
                    value={houseNumber}
                    onChange={(e) =>
                      setHouseNumber(e.target.value)
                    }
                    placeholder="e.g. RS3-A708/ Not resident"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Lock
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a password"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Confirm Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-orange-400">
                  <Lock
                    size={18}
                    className="text-gray-500"
                  />

                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Repeat password"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs leading-relaxed text-gray-500">
                By signing up you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-center text-sm text-gray-600">
                Have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Sign In
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