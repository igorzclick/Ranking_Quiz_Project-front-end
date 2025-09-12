import { SignInView } from "../pages/SignIn/SignIn.view";
import { SignUpView } from "../pages/SignUp/SignUp.view";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <h1>Home</h1>
    },
    {
        path: '/login',
        element: <SignInView />
    },
    {
        path: '/register',
        element: <SignUpView />
    }
])