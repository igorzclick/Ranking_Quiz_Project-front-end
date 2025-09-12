import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Provider } from "./components/ui/provider";

function App() {
    return (
            <Provider>
                <RouterProvider router={router} />
            </Provider> 
        )
}

export default App;
