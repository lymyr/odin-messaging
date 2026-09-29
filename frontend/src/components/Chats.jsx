import { useContext, useEffect, useState } from "react"
import CredContext from "../contexts/CredContext.js"
import { Link } from "react-router"

export default function Chats() {
    const [token, setToken, user] = useContext(CredContext)

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

    return (
        <>
        {
            loading ?
                <h1>Loading...</h1>
            : error ?
                <h1>{error}</h1>
            : chats.length == 0 ?
                <h1>Chat is empty</h1>
            : 
                <div>
                    {
                        chats.map(c => {
                            return (
                                <Link key={c.id} to={`/chats/${c.id}`}>
                                    <div>
                                        {
                                            c.participants
                                                .filter(participant => participant.user.id != user.id || c.participants.length == 1)
                                                .map(participant => {
                                                    return (
                                                        <div key={participant.user.id}>
                                                            <p>{participant.user.name}</p>
                                                            <p>{participant.user.id}</p>
                                                        </div>     
                                                    )
                                                })
                                        }
                                        <p>{c.messages[0].text}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
        }
        
        </>
    )
}