import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer/Footer";
import Assembly from "../../views/admin/assembly";
import BuildScreen from "../../views/admin/build-screen";
import Login from "../../views/admin/login";
import Profile from "../../views/admin/profile";
import ProtectedRoute from "../../ProtectedRoute";

interface AdminLayoutProps {
    children?: React.ReactNode;
}

export default function Admin(props: AdminLayoutProps) {
    const [open, setOpen] = React.useState(true);
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('');

    // Check if current route is login page
    const isLoginPage = location.pathname === "/admin/login";

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    React.useEffect(() => {
        document.documentElement.dir = "ltr";
    }, []);

    // Render login page without sidebar/navbar
    if (isLoginPage) {
        return (
            <div className="min-h-screen w-full bg-gray-50 dark:bg-navy-900">
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full">
            <Sidebar open={open} onClose={() => setOpen(false)} />

            {/* Main Content */}
            <main className="mx-[12px] flex-1 min-h-0 h-full overflow-y-auto bg-gray-50 transition-all dark:!bg-navy-900 md:pr-2 xl:ml-[280px]">
                <Navbar onOpenSidenav={() => setOpen(true)} pageTitle={pageTitle} />

                <div className="p-2 md:pr-2">
                    {props.children || (
                        <Routes>
                            <Route element={<ProtectedRoute />}>
                                <Route path="/assembly" element={<Assembly setPageTitle={setPageTitle} />} />
                                <Route path="/build-screen/:id" element={<BuildScreen setPageTitle={setPageTitle} />} />
                                <Route path="/profile" element={<Profile setPageTitle={setPageTitle} />} />
                            </Route>
                            <Route
                                path="/"
                                element={<Navigate to="/admin/login" replace />}
                            />
                        </Routes>
                    )}
                </div>

                <div className="p-3">
                    <Footer />
                </div>
            </main>
        </div>
    );
}
