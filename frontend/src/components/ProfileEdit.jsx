import { useContext, useState } from "react"
import CredContext from "../contexts/CredContext";
import styles from "./ProfileEdit.module.css"

export default function ProfileEdit({user, setIsEdit, setUser}) {
    const [token, setToken] = useContext(CredContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const [formData, setFormData] = useState({
        displayName: user.name,
        description: user.description
    })

    async function handleSubmit() {
        setLoading(true)
        try {
            const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL;
            const res = await fetch(`${url}/v1/users`, {
                method: "put",
                body: JSON.stringify(formData),
                headers: {
                    authorization: `bearer ${token}`,
                    'content-type': 'application/json'
                }
            })
            if (!res.ok) {
                throw res
            }
            const json = await res.json()
            setUser(json.data.user)
            setToken(json.data.token)
            setError()
            setIsEdit(false)
        }
        catch(e) {
            if (e.headers?.get('content-type').includes("application/json")) {
                const res = await e.json()
                setError(res.errors)
            }
            else
                setError({generic: e.message})
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div>
                    <div>
                        <label htmlFor="displayName">Display Name</label>
                        <input id="displayName" value={formData?.displayName} onChange={(e) => {
                            setFormData({...formData, displayName: e.target.value})
                        }}/>
                        {error && error.displayName && <p className={styles.error}>{error.displayName.msg}</p>}
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <input id="description" value={formData?.description} onChange={(e) => {
                            setFormData({...formData, description: e.target.value})
                        }}/>
                    </div>
                    {error && error.description && <p className={styles.error}>{error.description.msg}</p>}
                    {error && error.generic && <p className={styles.error}>{error.generic}</p>}
                </div>
                <div>
                    <button className={styles.button} onClick={() => setIsEdit(false)} disabled={loading}>Discard</button>
                    <button className={styles.button} onClick={handleSubmit} disabled={loading}>Submit</button>
                </div>
            </div>
        </>
    )
}