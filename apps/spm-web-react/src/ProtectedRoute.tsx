import React, { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userService } from './api/services/userService';

export interface ProtectedRouteProps {
    children?: ReactNode
};

const ProtectedRoute: React.FC = (props: ProtectedRouteProps) => {
    const isAuthenticated = userService.isLoggedIn();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return props.children ? props.children : <Outlet />;
}

export default ProtectedRoute;
