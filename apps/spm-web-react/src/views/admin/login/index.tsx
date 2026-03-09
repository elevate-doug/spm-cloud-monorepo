import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/card";
import SelectField from "../../../components/fields/SelectField";
import { tenantService } from "../../../api/services/tenantService";
import { userService } from "../../../api/services/userService";
import logo from "../../../assets/main-logo.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../components/toast";
import { useDatabaseConnection } from "../../../hooks/useDatabaseConnection";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [selectedTenantId, setSelectedTenantId] = useState("");
    const [showDbDialog, setShowDbDialog] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const dbStatus = useDatabaseConnection();
    const dbDown = dbStatus === "disconnected" || dbStatus === "reconnecting";

    const { isLoading, data: tenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {
            return tenantService.listTenants();
        }
    });

    const { isPending, mutate: loginUser } = useMutation({
        mutationFn: () => userService.login(selectedTenantId, username, password),
        onError: (error: unknown) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 500 || status === 503) {
                showToast('Login failed — database may be unavailable', 'error');
            } else {
                showToast('Failed To Login', 'error');
            }        
            setPassword('');
        },
        onSuccess: (data: boolean) => {
            if (data) {                
                navigate("/admin/assembly");
            } else {
                showToast('Failed To Login', 'error');
                setPassword('');
            }
        }
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (dbDown) {
            setShowDbDialog(true);
            return;
        }

        loginUser();
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <Card extra="w-full max-w-md p-8">
                {/* Logo/Brand */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src={logo}
                            alt="SPM"
                            className="h-auto w-full max-w-[180px]"
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
                            disabled={isLoading}
                            options={(tenants ?? []).map(tenant => ({
                                value: tenant.id,
                                label: tenant.displayName
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
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400"
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
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending || isLoading}
                        className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                        Sign In
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => console.log("Forgot password clicked")}
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        Forgot password?
                    </button>
                </div>
            </Card>

            {showDbDialog && (
                <DatabaseUnavailableDialog onClose={() => setShowDbDialog(false)} />
            )}            
        </div>
    );
};

function DatabaseUnavailableDialog({ onClose }: { onClose: () => void }) {
    const dbStatus = useDatabaseConnection();
    const dbDown = dbStatus === "disconnected" || dbStatus === "reconnecting";

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="mx-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-navy-600 dark:bg-navy-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
                    Database Unavailable
                </h3>

                {/* Message */}
                <p className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    The database connection has been lost. Login is unavailable until the connection is restored.
                </p>

                {/* Live status indicator */}
                <div className="mb-5 flex items-center justify-center gap-2 text-sm">
                    {dbDown ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                            </span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                                Waiting for connection...
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                                Connection restored — you may sign in
                            </span>
                        </>
                    )}
                </div>

                {/* Dismiss button */}
                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                    {dbDown ? "OK" : "Sign In"}
                </button>
            </div>
        </div>
    );
}

export default Login;
