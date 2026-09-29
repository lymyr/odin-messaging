import { useState } from "react";
import InputLabel from "../components/InputLabel";
import { Link, useNavigate } from "react-router";

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const [errors, setErrors] = useState()
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    
    async function handleLogin() {
        setLoading(true)
        const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL
        try {
            const res = await fetch(`${url}/v1/login`, {
                method: "post",
                body: JSON.stringify(formData),
                headers: {
                    "content-type": "application/json"
                }
            })
            if (!res.ok) {
                throw res
            }
            const json = await res.json()
            localStorage.setItem("token", json.data.token)
            nav("/")
        }
        catch(e) {
            if (e.headers && e.headers.get('content-type').includes("application/json")) {
                const errRes = await e.json()
                setErrors(errRes.errors)
            }
            else
                setErrors({generic: e.message})
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <InputLabel label={"username"} formData={formData} setFormData={setFormData}/>
                    { errors && errors.username &&
                        <p>{errors.username.msg}</p>
                    }
                </div>
                <div>
                    <InputLabel label={"password"} type={"password"} formData={formData} setFormData={setFormData}/>
                    { errors && errors.password &&
                        <p>{errors.password.msg}</p>
                    }
                </div>
                { errors && errors.generic &&
                    <p>{errors.generic}</p>
                }
                <button onClick={handleLogin} disabled={loading}>Log in</button>
            </form>
            <p>No account? Register <Link to="/register">here</Link></p>
        </div>
    )
}