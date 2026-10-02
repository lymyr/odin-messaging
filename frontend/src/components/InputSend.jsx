import { useContext, useState } from "react"
import { useParams } from "react-router"
import CredContext from "../contexts/CredContext"
import styles from "./InputSend.module.css"

export default function InputSend({messages, setMessages}) {
    const [token, setToken] = useContext(CredContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [text, setText] = useState("")
    const params = useParams()

    const [chatId, setChatId] = useState(params.chatId)

    function handleSend() {
        const controller = new AbortController();

        (async () => {
            setLoading(true)
            try {
                const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
                const api_url = chatId ? `${url}/v1/chats/${chatId}` : `${url}/v1/chats/user/${params.userId}`
                const res = await fetch(api_url, {
                    method: "post",
                    headers: {
                        "authorization": `bearer ${token}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        message: text
                    }),
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw res
                }
                const json = await res.json()
                setText("")
                setChatId(json.data.message.chatId)
                setToken(json.data.token)
                setError()

                setMessages([...messages, json.data.message])
            }
            catch(e) {
                setError(e.message)
            }
            finally {
                setLoading(false)
            }
        })()

        return () => controller.abort()
    }

    return (
        <>
            {
                error && 
                    <div className={styles.errorContainer}>
                        <p className={styles.error}>{error}</p>
                        <button onClick={() => setError()}>X</button>
                    </div>
            }
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSend()
            }}>
                <input
                    value={text}
                    onChange={(e) => {setText(e.target.value)}}
                    className={styles.input}
                />
                <button
                    disabled={loading}
                    className={styles.button}
                >Send</button>
            </form>
        </>
    )
}