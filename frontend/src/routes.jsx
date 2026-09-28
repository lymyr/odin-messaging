import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages"

export default [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/messages",
        element: <App />,
        children: [
            {
                index: true,
                element: <Messages />
            }
        ]
    }
]