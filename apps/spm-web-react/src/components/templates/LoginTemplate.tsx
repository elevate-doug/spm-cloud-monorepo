import { Button } from "@steris-spm/lingo";
import Card from "../card";
import SelectField from "../fields/SelectField";
import type { SelectOption } from "../fields/SelectField";

export interface LoginTemplateProps {
    logoSrc: string;
    username: string;
    onUsernameChange: (value: string) => void;
    password: string;
    onPasswordChange: (value: string) => void;
    selectedTenantId: string;
    onTenantChange: (value: string) => void;
    tenantOptions: SelectOption[];
    isLoadingTenants: boolean;
    isSubmitting: boolean;
    showDbDialog: boolean;
    onCloseDbDialog: () => void;
    dbDown: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onForgotPassword: () => void;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({
    logoSrc,
    username,
    onUsernameChange,
    password,
    onPasswordChange,
    selectedTenantId,
    onTenantChange,
    tenantOptions,
    isLoadingTenants,
    isSubmitting,
    showDbDialog,
    onCloseDbDialog,
    dbDown,
    onSubmit,
    onForgotPassword,
}) => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <Card extra="w-full max-w-md p-8">
                {/* Logo/Brand */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src={logoSrc}
                            alt="SPM"
                            className="h-auto w-full max-w-[180px]"
                        />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    {/* Organization/Tenant Selection */}
                    <div className="mb-4">
                        <SelectField
                            id="organization"
                            label="Organization"
                            value={selectedTenantId}
                            onChange={onTenantChange}
                            placeholder="Select an organization"
                            variant="auth"
                            disabled={isLoadingTenants}
                            options={tenantOptions}
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
                            onChange={(e) => onUsernameChange(e.target.value)}
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
                            onChange={(e) => onPasswordChange(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400"
                        />
                    </div>

                    {/* Submit Button - uses lingo design system */}
                    <div className="w-full">
                        <Button
                            mode="contained"
                            onPress={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            customStyle={{ width: '100%' }}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                {/* Forgot Password Link */}
                <div className="mt-4 text-center">
                    <Button mode="text" onPress={onForgotPassword}>
                        Forgot password?
                    </Button>
                </div>
            </Card>

            {showDbDialog && (
                <DatabaseUnavailableDialog onClose={onCloseDbDialog} dbDown={dbDown} />
            )}
        </div>
    );
};

interface DatabaseUnavailableDialogProps {
    onClose: () => void;
    dbDown: boolean;
}

const DatabaseUnavailableDialog: React.FC<DatabaseUnavailableDialogProps> = ({ onClose, dbDown }) => {
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

                {/* Dismiss button - uses lingo design system */}
                <div className="w-full">
                    <Button
                        mode="contained"
                        onPress={onClose}
                        customStyle={{ width: '100%' }}
                    >
                        {dbDown ? "OK" : "Sign In"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginTemplate;
