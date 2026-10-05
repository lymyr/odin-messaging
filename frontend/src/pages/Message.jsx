import { useContext, useEffect, useRef } from "react"
import CredContext from "../contexts/CredContext.js"
import InputSend from "../components/InputSend.jsx"
import PageContainer from "../components/PageContainer.jsx"
import styles from "./Message.module.css"
import useFetchMsgs from "../hooks/useFetchMsgs.js"
import { useParams } from "react-router"

export default function Message() {
    const params = useParams()
    const [, , user] = useContext(CredContext)
    const lastMsgRef = useRef()
    const [messages, setMessages, loading, error] = useFetchMsgs()

    useEffect(() => {
        lastMsgRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <PageContainer  title={"Message"}>
            <div className={styles.container}>
                <h1>{params.userId}</h1>
                <div className={styles.messageContainer}>
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
                                            <p>{new Date(message.dateAdded).toLocaleString()}</p>
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