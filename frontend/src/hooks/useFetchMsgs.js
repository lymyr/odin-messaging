import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import CredContext from "../contexts/CredContext";

export default function useFetchMsgs() {
    const params = useParams()
    const [token, setToken] = useContext(CredContext)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setLoading(true)
            try {
                const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
                const api_url = params.chatId ? `${url}/v1/chats/${params.chatId}` : `${url}/v1/chats/user/${params.userId}`
                const res = await fetch(api_url, {
                    headers: {
                        "authorization": `bearer ${token}`,
                    },
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw res
                }
                const json = await res.json()
                setMessages(json.data.messages)
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

    return [messages, setMessages, loading, error]
}