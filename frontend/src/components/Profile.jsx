import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import CredContext from "../contexts/CredContext"

export default function Profile() {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [token, setToken] = useContext(CredContext)
    const params = useParams()

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setLoading(true)
            try {
                const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
                const res = await fetch(`${url}/v1/users/${params.userId}`, {
                    headers: {
                        "authorization": `bearer ${token}`,
                    },
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw res
                }
                const json = await res.json()
                setUser(json.data.user)
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
    }, [params.userId])

    return (
        <>
        { 
            loading ? 
                <h1>loading</h1>
            : error ? 
                <h1>{error}</h1>
            : 
                <div>
                    <h1>{user.id}</h1>
                    <p>{user.name}</p>
                    <p>{user.description}</p>
                </div>

        }
        </>
    )
}