"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");

  const [verified, setVerified] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (token.length > 0) {
      verifyEmail();
    }
  }, [token]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const verifyEmail = async () => {
    try {
      const response = await axios.post("/api/users/verifyEmail", { token });
      setVerified(true);
      toast.success(response.data.message, { duration: 4000 });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Auth Labs"
          src="https://pages.okta.com/rs/855-QAH-699/images/email-main-template_auth0-by-okta-logo_black_279x127_3x.png"
          className="mx-auto h-30 w-auto"
        />
        <Toaster />
        <p className="mt-10 text-center text-sm/6 text-gray-500"></p>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"></div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"></div>
        {verified ? (
          <div>
            <p className="mt-10 text-center text-sm/6 text-gray-600">
              Your email has been verified successfully. You can now login.
            </p>
            <button className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <Link href="/login">Login Here</Link>
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-10 text-center text-sm/6 text-gray-600">
              You will receive a magic link on your email to verify your
              account.
            </p>
          </div>
        )}
        {error && (
          <p className="mt-10 text-center text-sm/6 text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
