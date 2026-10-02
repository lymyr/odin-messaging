import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./components/Chats"
import UserList from "./components/UserList"
import Profile from "./components/Profile";
import Message from "./components/Message";

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
                // todo: decide whether to keep as separate page or
                // render as aside
                index: true,
                element: <Chats />
            },
            {
                path: "users",
                element: <UserList />,
            },
            {
                path: "users/:userId",
                element: <Profile />
            },
            {
                path: "message/:userId",
                element: <Message />
            },
            {
                path: "chats/:chatId/:userId",
                element: <Message />
            }
        ]
    }
]