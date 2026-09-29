import { useContext, useEffect, useState } from "react"
import CredContext from "../contexts/CredContext";
import SearchParamContext from "../contexts/SearchParamContext";
import { Link } from "react-router";

export default function UserList() {
    const [searchParams] = useContext(SearchParamContext)
    const [token, setToken] = useContext(CredContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [users, setUsers] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
        (async () => {
            try {
                setLoading(true)
                const res = await fetch(`${url}/v1/users?${searchParams.toString()}`, {
                    headers: {
                        "authorization": `bearer ${token}`,
                    },
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw res
                }
                const json = await res.json()
                setUsers(json.data.users)
                setToken(json.data.token)
                setError()
            }
            catch(e) {
                setError(e.message)
            }
            finally {
                setLoading(false)
            }
        })()
        
        return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    return (
        <>
            {
                loading ?
                    <h1>Loading...</h1> 
                : error ?
                    <h1>{error}</h1>
                : users.length == 0 ?
                    <h1>No user found</h1>
                : 
                    users.map(u => {
                        return (
                            <Link to={`/users/${u.id}`} key={u.id}>
                                <div>
                                    <p>{u.id}</p>
                                    <p>{u.name}</p>
                                </div>
                            </Link>
                        )
                    })
            }
        </>
    )
}