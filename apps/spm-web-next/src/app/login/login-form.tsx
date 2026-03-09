"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from "@/components/card";
import SelectField from "@/components/select-field";
import { useToast } from "@/components/toast";
import { login } from "@/lib/actions/auth";
import type { Tenant } from "@/types/assembly";

interface LoginFormProps {
  tenants: Tenant[];
}

export default function LoginForm({ tenants }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTenantId || !username || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    startTransition(async () => {
      const result = await login(selectedTenantId, username, password);

      if (result.success) {
        router.push("/assembly");
        router.refresh();
      } else {
        showToast(result.error || "Failed to login", "error");
        setPassword("");
      }
    });
  };

  return (
    <Card extra="w-full max-w-md p-8">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/main-logo.png"
            alt="SPM"
            width={180}
            height={45}
            className="h-auto"
            priority
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Organization/Tenant Selection */}
        <div className="mb-4">
          <SelectField
            id="organization"
            label="Organization"
            value={selectedTenantId}
            onChange={setSelectedTenantId}
            placeholder="Select an organization"
            variant="auth"
            disabled={isPending}
            options={tenants.map((tenant) => ({
              value: tenant.id,
              label: tenant.displayName,
            }))}
          />
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-navy-700 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isPending}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-navy-700 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isPending}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Forgot password?
        </button>
      </div>
    </Card>
  );
}
