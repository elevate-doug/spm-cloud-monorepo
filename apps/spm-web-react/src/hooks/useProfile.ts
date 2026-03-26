import { useEffect } from "react";
import { userService } from "../api/services/userService";
import { useLaborStandard } from "./useLaborStandard";

export interface ProfileUser {
    userName: string;
    name?: string;
    initials: string;
    email: string;
    location?: string;
    tenant?: string;
    assignment?: string;
    shift?: string;
}

export interface UseProfileReturn {
    currentUser: ProfileUser | null;
    laborStandard: number;
    handleEdit: () => void;
}

export function useProfile(setPageTitle: (title: string) => void): UseProfileReturn {
    const currentUser = userService.getCurrentUser();
    const laborStandard = useLaborStandard();

    useEffect(() => {
        setPageTitle(currentUser?.userName ?? "");
    }, [currentUser, setPageTitle]);

    const handleEdit = () => {
        console.log("Edit profile clicked");
    };

    return {
        currentUser,
        laborStandard,
        handleEdit,
    };
}
