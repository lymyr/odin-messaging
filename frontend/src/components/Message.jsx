import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import CredContext from "../contexts/CredContext"
import InputSend from "./InputSend"
import PageContainer from "./PageContainer"

export default function Message() {
    const params = useParams()
    const [token, setToken, user] = useContext(CredContext)
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

    return (
        <PageContainer>
            <div>
                <h1>{params.userId}</h1>
                <div>
                    {
                        loading ?
                            <p>Loading...</p>
                        : error ?
                            <p>{error}</p>
                        : messages.length == 0 ?
                            <p>no messages yet it seems</p>
                        :
                            messages.map(message => {
                                return (
                                    <div key={message.id} className={message.userId != user.id ? "otherMsg" : undefined}>
                                        { message.userId != user.id &&
                                            <p>{message.userId}</p>
                                        }
                                        <p>{message.text}</p>
                                        <p>{message.dateAdded}</p>
                                    </div>
                                )
                            })
            
                    }
                </div>
                <div>
                    <InputSend messages={messages} setMessages={setMessages}/>
                </div>
            </div>
        </PageContainer>
    )
}