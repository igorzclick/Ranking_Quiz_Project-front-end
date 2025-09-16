import { SignInView } from "../pages/SignIn/SignIn.view";
import { SignUpView } from "../pages/SignUp/SignUp.view";
import { HomeView } from "../pages/Home/Home.view";
import { createBrowserRouter } from "react-router";
import { PrivateRouteProvider } from "./components/PrivateRouteProvider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouteProvider>
        <HomeView />
      </PrivateRouteProvider>
    ),
  },
  {
    path: "/login",
    element: <SignInView />,
  },
  {
    path: "/register",
    element: <SignUpView />,
  },
]);
