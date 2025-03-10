"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [passwordResetLinkSent, setPasswordResetLinkSent] =
    React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user.email) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user.email]);

  useEffect(() => {
    if (user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user.password]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const sendResetPasswordMail = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const foundUser = await axios.get(`/api/users/me?email=${user.email}`);
      const userId = foundUser.data._id;
      const response = await axios.post("/api/users/sendResetPasswordMail", {
        userId: userId,
        email: user.email,
      });
      setPasswordResetLinkSent(true);
      toast.success(response.data.message, { duration: 4000 });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setUser({ email: "", password: "" });
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetPassword", {
        token: token,
        password: user.password,
      });
      toast.success(response.data.message, { duration: 4000 });
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Toaster />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Auth labs"
          src="https://pages.okta.com/rs/855-QAH-699/images/email-main-template_auth0-by-okta-logo_black_279x127_3x.png"
          className="mx-auto h-30 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {loading ? "Processing" : "Reset Password"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          {token ? (
            ""
          ) : (
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          )}

          {token ? (
            <div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Enter New Password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={token ? resetPassword : sendResetPasswordMail}
              disabled={buttonDisabled}
            >
              {token ? "Reset Password" : "Send Reset Password Mail"}
            </button>
          </div>
        </form>
        {passwordResetLinkSent ? (
          <div>
            <p className="mt-10 text-center text-sm/6 text-gray-600">
              You will receive a magic link on your email to Reset Your
              Password.
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
