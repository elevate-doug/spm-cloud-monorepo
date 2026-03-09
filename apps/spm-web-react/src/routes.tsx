// Views Imports
import Assembly from "./views/admin/assembly";
import BuildScreen from "./views/admin/build-screen";
import Profile from "./views/admin/profile";
import SignIn from "./views/auth/SignIn";

const routes = [
  {
    name: "Assembly",
    layout: "/admin",
    path: "assembly",
    component: <Assembly />,
  },
  {
    name: "Build Screen",
    layout: "/admin",
    path: "build-screen",
    component: <BuildScreen />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    component: <SignIn />,
  },
];

export default routes;
