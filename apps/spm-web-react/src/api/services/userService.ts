import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api/endpoints';
import { jwtDecode } from 'jwt-decode';

/**
 * Authentication Service
 * Handles user and tenant selection and storage
 */

interface JwtUser {
    sub: string;
    unique_name: string;
    name: string;
    tenantId: string;
    tenant: string;
    locationId: string;
    location: string;
    shiftId: string;
    shift: string;
    assignmentId: string;
    assignment: string;
    exp: Date;
}
export type User = Partial<Omit<Omit<JwtUser, 'sub'>, 'unique_name'>> & {
    userId: string;
    userName: string;
    initials: string;
    email: string;
};

interface UserAuth {
    access_token: string;
    expires_in: number;
}

const USER_STORAGE_KEY = 'spm_selected_user';

class UserService {
    /**
     * Get the currently selected tenant from storage
     */
    getCurrentUser(): User | null {
        try {
            const token = localStorage.getItem(USER_STORAGE_KEY);
            if (token) {
                const dec = jwtDecode<JwtUser>(token);                
                
                return {
                    ... dec,
                    userId: dec.sub,
                    userName: dec.unique_name,
                    initials: (/\s/).test(dec.name) ? dec.name.split(' ').map((p) => p[0].toUpperCase()).join('') : dec.name[0].toUpperCase(),
                    email: 'fakeemail@fakehospital.com'
                };
            }
        } catch (error) {
            console.error('Error reading user from storage:', error);
        }
        return null;
    }

    /**
     * Get the user auth header value for API calls
     */
    getAuthHeader(excludeBearer?: boolean): string | undefined {
        const token = localStorage.getItem(USER_STORAGE_KEY);
        if (excludeBearer) {
            return token ?? undefined;
        }
        return token ? `Bearer ${token}` : undefined;
    }

    /**
     * Clear the selected user from storage
     */
    clearSelecteduser(): void {
        try {
            localStorage.removeItem(USER_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing user from storage:', error);
        }
    }

    /**
     * Check if a user is selected (not default)
     */
    isLoggedIn(): boolean {
        try {
            return localStorage.getItem(USER_STORAGE_KEY) !== null;
        } catch {
            return false;
        }
    }

    login(tenant: string, userName: string, password: string): Promise<boolean> {
        const url = API_ENDPOINTS.USER.LOGIN;
        return apiClient.post<UserAuth>(url, {
            tenant,
            userName,
            password
        }).then(({ data }) => {
            if (!data) {
                localStorage.removeItem(USER_STORAGE_KEY);
                return false;
            }
            localStorage.setItem(USER_STORAGE_KEY, data.access_token);
            return true;
        });
    }
}

// Export singleton instance
export const userService = new UserService();