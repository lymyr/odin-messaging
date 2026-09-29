import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./components/Messages"
import UserList from "./components/UserList"
import Profile from "./components/Profile";

export default [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Messages />
            },
            {
                path: "users",
                element: <UserList />,
            },
            {
                path: "users/:userId",
                element: <Profile />
            }
        ]
    }
]