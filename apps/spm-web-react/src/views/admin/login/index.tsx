import { useLogin } from "../../../hooks/useLogin";
import LoginTemplate from "../../../components/templates/LoginTemplate";
import logo from "../../../assets/main-logo.png";

const Login = () => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        selectedTenantId,
        setSelectedTenantId,
        tenantOptions,
        isLoadingTenants,
        isSubmitting,
        showDbDialog,
        setShowDbDialog,
        dbDown,
        handleSubmit,
        handleForgotPassword,
    } = useLogin();

    return (
        <LoginTemplate
            logoSrc={logo}
            username={username}
            onUsernameChange={setUsername}
            password={password}
            onPasswordChange={setPassword}
            selectedTenantId={selectedTenantId}
            onTenantChange={setSelectedTenantId}
            tenantOptions={tenantOptions}
            isLoadingTenants={isLoadingTenants}
            isSubmitting={isSubmitting}
            showDbDialog={showDbDialog}
            onCloseDbDialog={() => setShowDbDialog(false)}
            dbDown={dbDown}
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
        />
    );
};

export default Login;
