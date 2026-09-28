import { useState } from "react";
import InputLabel from "../components/InputLabel";
import { Link, useNavigate } from "react-router";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState()
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    
    async function handleRegister() {
        setLoading(true)
        const url = import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_API_URL
        try {
            const res = await fetch(`${url}/v1/register`, {
                method: "post",
                body: JSON.stringify(formData),
                headers: {
                    "content-type": "application/json"
                }
            })
            if (!res.ok) {
                throw res
            }
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
                    {errors && errors.username &&
                        <p>{errors.username.msg}</p>
                    }
                </div>
                <div>
                    <InputLabel label={"display name"} formDataProp={"displayName"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.displayName &&
                        <p>{errors.displayName.msg}</p>
                    }
                </div>
                <div>
                    <InputLabel label={"password"} type={"password"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.password &&
                        <p>{errors.password.msg}</p>
                    }
                </div>
                <div>
                    <InputLabel label={"confirm password"} formDataProp={"confirmPassword"} type={"password"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.confirmPassword &&
                        <p>{errors.confirmPassword.msg}</p>
                    }
                </div>
                <button onClick={handleRegister} disabled={loading}>Register</button>
                {errors && errors.generic &&
                    <p>{errors.generic}</p>
                }
            </form>
            <p>Already have an account? Sign in <Link to="/">here</Link></p>
        </div>
    )
}