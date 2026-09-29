import { useContext, useState } from "react"
import CredContext from "../contexts/CredContext";

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
            <input value={formData?.displayName} onChange={(e) => {
                setFormData({...formData, displayName: e.target.value})
            }}/>
            {error && error.displayName && <p>{error.displayName.msg}</p>}
            <input value={formData?.description} onChange={(e) => {
                setFormData({...formData, description: e.target.value})
            }}/>
            {error && error.description && <p>{error.description.msg}</p>}
            {error && error.generic && <p>{error.generic}</p>}
            <button onClick={() => setIsEdit(false)} disabled={loading}>Discard</button>
            <button onClick={handleSubmit} disabled={loading}>Submit</button>
        </>
    )
}