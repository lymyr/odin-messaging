import { useContext, useState } from "react"
import CredContext from "../contexts/CredContext"
import { Link, useNavigate } from "react-router"
import SearchParamContext from "../contexts/SearchParamContext"
import styles from "./Header.module.css"

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
            <div className={styles.header}>
                <div>
                    <h1>Messaging</h1>
                    <div>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            navToUserList()
                        }}>
                            <input
                                className={styles.search}
                                type="text"
                                placeholder="Search users"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value) }}
                            />
                            <button className={styles.button}>Search</button>
                        </form>
                    </div>
                </div>
                <div>
                    <nav>
                        <Link to={"/"}>
                            <button>Home</button>
                        </Link>
                        <Link to={"/users"}>
                            <button>All users</button>
                        </Link>
                        <Link to={`/users/${user?.id}`}>
                            <button>Profile</button>
                        </Link>
                    </nav>
                    <button className={styles.button} onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </header>
    )
}