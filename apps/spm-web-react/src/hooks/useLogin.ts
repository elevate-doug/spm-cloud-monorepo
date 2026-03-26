import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tenantService } from "../api/services/tenantService";
import { userService } from "../api/services/userService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../components/toast";
import { useDatabaseConnection } from "./useDatabaseConnection";
import type { SelectOption } from "../components/fields/SelectField";

export interface UseLoginReturn {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    selectedTenantId: string;
    setSelectedTenantId: (value: string) => void;
    tenantOptions: SelectOption[];
    isLoadingTenants: boolean;
    isSubmitting: boolean;
    showDbDialog: boolean;
    setShowDbDialog: (value: boolean) => void;
    dbDown: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    handleForgotPassword: () => void;
}

export function useLogin(): UseLoginReturn {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [selectedTenantId, setSelectedTenantId] = useState("");
    const [showDbDialog, setShowDbDialog] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const dbStatus = useDatabaseConnection();
    const dbDown = dbStatus === "disconnected" || dbStatus === "reconnecting";

    const { isLoading: isLoadingTenants, data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => tenantService.listTenants(),
    });

    const { isPending, mutate: loginUser } = useMutation({
        mutationFn: () => userService.login(selectedTenantId, username, password),
        onError: (error: unknown) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 500 || status === 503) {
                showToast("Login failed — database may be unavailable", "error");
            } else {
                showToast("Failed To Login", "error");
            }
            setPassword("");
        },
        onSuccess: (data: boolean) => {
            if (data) {
                navigate("/admin/assembly");
            } else {
                showToast("Failed To Login", "error");
                setPassword("");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dbDown) {
            setShowDbDialog(true);
            return;
        }
        loginUser();
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
    };

    const tenantOptions: SelectOption[] = (tenants ?? []).map((tenant) => ({
        value: tenant.id,
        label: tenant.displayName,
    }));

    return {
        username,
        setUsername,
        password,
        setPassword,
        selectedTenantId,
        setSelectedTenantId,
        tenantOptions,
        isLoadingTenants,
        isSubmitting: isPending || isLoadingTenants,
        showDbDialog,
        setShowDbDialog,
        dbDown,
        handleSubmit,
        handleForgotPassword,
    };
}
