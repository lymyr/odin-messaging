import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import CredContext from "../contexts/CredContext"
import ProfileEdit from "./ProfileEdit"
import styles from "./Profile.module.css"
import PageContainer from "./PageContainer"

export default function Profile() {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [token, setToken, loggedUser] = useContext(CredContext)
    const [isEdit, setIsEdit] = useState(false)
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
                <div className={styles.infoContainer}>
                    <div className={styles.loading}></div>
                    <p>Loading profile...</p>
                </div> 
            : error ?
                <div className={styles.infoContainer}>
                    <h1 className={styles.pageText}>{error}</h1>
                </div>
            : 
                <PageContainer>
                    <div className={styles.container}>
                        <div className={styles.details}>
                            <h1>{user?.id}</h1>
                            <div>
                                <div className={styles.nameDesc}>
                                    {
                                        !isEdit ?
                                            <>
                                                <p>{user?.name}</p>
                                                <p>{user?.description}</p>
                                            </>
                                        :
                                            <ProfileEdit user={user} setIsEdit={setIsEdit} setUser={setUser}/>
                                    }
                                </div>
                                {
                                    user.id == loggedUser.id && !isEdit &&
                                        <button className={styles.editBtn} onClick={() => setIsEdit(true)}>Edit</button>
                                }
                            </div>
                        </div>
                        <Link to={`/message/${user?.id}`}>
                            <button className={styles.msgBtn}>Message</button>
                        </Link>
                    </div>
                </PageContainer>
        }
        </>
    )
}