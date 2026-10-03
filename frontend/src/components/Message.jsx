import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import CredContext from "../contexts/CredContext"
import InputSend from "./InputSend"
import PageContainer from "./PageContainer"
import styles from "./Message.module.css"

export default function Message() {
    const params = useParams()
    const [token, setToken, user] = useContext(CredContext)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const lastMsgRef = useRef()

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

    useEffect(() => {
        lastMsgRef?.current.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <PageContainer  title={"Message"}>
            <div className={styles.container}>
                <h1>{params.userId}</h1>
                <div className={styles.messageContainer} ref={lastMsgRef}>
                    {
                        loading ?
                            <div className={styles.loading}></div>
                        : error ?
                            <p className={styles.error}>{error}</p>
                        : messages.length == 0 ?
                            <p>no messages yet it seems</p>
                        :
                            messages.map((message, i) => {
                                return (
                                    <div 
                                        key={message.id} 
                                        className={message.userId != user.id ? `${styles.otherMsg} ${styles.message}` : styles.message}
                                        ref={messages[i] == message ? lastMsgRef : undefined}
                                    >
                                        <div>
                                            { message.userId != user.id &&
                                                <p className={styles.otherMsgName}>{message.userId}</p>
                                            }
                                            <p>{message.dateAdded}</p>
                                        </div>
                                        <p>{message.text}</p>
                                        
                                    </div>
                                )
                            })
            
                    }
                </div>
                <div className={styles.inputContainer}>
                    <InputSend messages={messages} setMessages={setMessages} />
                </div>
            </div>
        </PageContainer>
    )
}