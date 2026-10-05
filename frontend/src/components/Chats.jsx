import { useContext, useEffect, useState } from "react"
import CredContext from "../contexts/CredContext.js"
import { Link } from "react-router"
import styles from "./Chats.module.css"
import PageContainer from "./PageContainer.jsx"

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
                <div className={styles.infoContainer}>
                    <div className={styles.loading}></div>
                    <p>Fetching chats...</p>
                </div>
            : error ?
                <div className={styles.infoContainer}>
                    <h1 className={styles.pageText}>{error}</h1>
                </div>
            : chats.length == 0 ?
                <div className={styles.infoContainer}>
                    <h1 className={styles.pageText}>Chat is empty</h1>
                </div>
            : 
                <PageContainer title={"Chats"}>
                    <div className={styles.chatsContainer}>
                        {
                            chats
                            .sort((a, b) => {
                                return a.messages[0].dateAdded < b.messages[0].dateAdded
                            }).map(c => {
                                return (
                                    <Link key={c.id} to={`/chats/${c.id}/${c.participants.filter(participant => participant.user.id != user.id || c.participants.length == 1)[0].user.id}`}>
                                        <div>
                                            {
                                                c.participants
                                                    .filter(participant => participant.user.id != user.id || c.participants.length == 1)
                                                    .map(participant => {
                                                        return (
                                                            <div className={styles.msgHeader} key={participant.user.id}>
                                                                <div className={styles.user}>
                                                                    <p>{participant.user.name}</p>
                                                                    <p>{participant.user.id}</p>
                                                                </div>
                                                                <p>{new Date(c.messages[0].dateAdded).toLocaleString()}</p>
                                                            </div>     
                                                        )
                                                    })
                                            }
                                            <p className={styles.text}><span>{c.messages[0].user.id == user.id ? "You" : c.messages[0].user.id}: </span>{c.messages[0].text}</p>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </PageContainer>
        }
        
        </>
    )
}