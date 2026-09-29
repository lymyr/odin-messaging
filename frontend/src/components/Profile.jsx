import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import CredContext from "../contexts/CredContext"
import ProfileEdit from "./ProfileEdit"

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
                <h1>loading</h1>
            : error ? 
                <h1>{error}</h1>
            : 
                <div>
                    <div>
                        <h1>{user?.id}</h1>
                        {
                            !isEdit ?
                                <>
                                    <p>{user?.name}</p>
                                    <p>{user?.description}</p>
                                </>
                            :
                                <ProfileEdit user={user} setIsEdit={setIsEdit} setUser={setUser}/>
                        }
                        
                        {
                            user.id == loggedUser.id && !isEdit &&
                                <button onClick={() => setIsEdit(true)}>Edit</button>
                        }
                    </div>
                    <Link to={`/message/${user?.id}`}>
                        <button>Message</button>
                    </Link>
                </div>
        }
        </>
    )
}