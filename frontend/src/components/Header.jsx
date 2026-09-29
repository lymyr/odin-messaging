import { useContext, useState } from "react"
import CredContext from "../contexts/CredContext"
import { Link, useNavigate } from "react-router"
import SearchParamContext from "../contexts/SearchParamContext"

export default function Header() {
    const [,setToken, user] = useContext(CredContext)
    const [searchParams, setSearchParams] = useContext(SearchParamContext)
    const [query, setQuery] = useState(searchParams.get("search") ? searchParams.get("search") : "")
    const nav = useNavigate()

    function handleLogout() {
        localStorage.removeItem("token")
        setToken()
    }

    function navToUserList() {
        setSearchParams({search: query})
        nav("/users?" + new URLSearchParams({search: query}))
    }

    return (
        <header>
            <div>
                <input 
                    type="text" 
                    placeholder="Search users" 
                    value={query} 
                    onChange={(e) => { setQuery(e.target.value) }}
                />
                <button onClick={navToUserList}>Search</button>
            </div>
            <div>
                <nav>
                    <Link to={"/"}>
                        <button>Home</button>
                    </Link>
                    <Link to={"/users"}>
                        <button>All users</button>
                    </Link>
                    <Link to={"/profile"}>
                        <button>{user?.id}</button>
                    </Link> 
                </nav>
                <button onClick={handleLogout}>Log out</button>
            </div>
        </header>
    )
}