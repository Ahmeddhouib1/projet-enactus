"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { login } from "@/services/admin/auth";
import { setAuthToken } from "@/lib/auth";
import FormField, { inputClassName } from "@/components/admin/FormField";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const response = await login(values);
      setAuthToken(response.token);
      const redirectTo = searchParams.get("from") || "/admin";
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-enactus-navy px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex justify-center">
          <Image src="/images/logo-enactus-ensi.png" alt="Enactus ENSI" width={186} height={100} className="h-14 w-auto" />
        </div>
        <h1 className="mt-8 text-center text-2xl font-bold text-enactus-navy">Admin Sign In</h1>
        <p className="mt-2 text-center text-sm text-enactus-dark-gray">
          Sign in to manage Enactus ENSI content.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className={inputClassName}
              {...register("email")}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={inputClassName}
              {...register("password")}
            />
          </FormField>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700" role="alert">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-enactus-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-enactus-navy transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
