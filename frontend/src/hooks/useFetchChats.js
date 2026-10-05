import { useContext, useEffect, useState } from "react";
import CredContext from "../contexts/CredContext";

export default function useFetchChats() {
    const [token, setToken] = useContext(CredContext)
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect (() => {
        const controller = new AbortController()
        const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
        (async () => {
            setLoading(true)
            try {
                const res = await fetch(`${url}/v1/chats`, {
                    headers: {
                        "authorization": `bearer ${token}`
                    },
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw res
                }
                const json = await res.json()
                setChats(json.data.chats)
                setToken(json.data.token)
                setError()
            }
            catch(e) {
                if (e.headers && e.headers.get('content-type').includes("application/json")) {
                    const errRes = await e.json()
                    if (errRes.errors && errRes.errors.token)
                        localStorage.removeItem("token")
                }
                else
                    setError(e.message)
            }
            finally {
                setLoading(false)
        }})();

        return () => {
            controller.abort()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [chats, loading, error]
}