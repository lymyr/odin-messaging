import { useState } from "react";
import InputLabel from "../components/InputLabel";
import { Link, useNavigate } from "react-router";
import styles from "./Register.module.css"

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
        <div className={styles.registerContainer}>
            <form  className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.inputLabel}>
                    <InputLabel label={"username"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.username &&
                        <p className={styles.error}>{errors.username.msg}</p>
                    }
                </div>
                <div className={styles.inputLabel}>
                    <InputLabel label={"display name"} formDataProp={"displayName"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.displayName &&
                        <p className={styles.error}>{errors.displayName.msg}</p>
                    }
                </div>
                <div className={styles.inputLabel}>
                    <InputLabel label={"password"} type={"password"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.password &&
                        <p className={styles.error}>{errors.password.msg}</p>
                    }
                </div>
                <div className={styles.inputLabel}>
                    <InputLabel label={"confirm password"} formDataProp={"confirmPassword"} type={"password"} formData={formData} setFormData={setFormData}/>
                    {errors && errors.confirmPassword &&
                        <p className={styles.error}>{errors.confirmPassword.msg}</p>
                    }
                </div>
                {errors && errors.generic &&
                    <p className={styles.error}>{errors.generic}</p>
                }
                <button className={styles.button} onClick={handleRegister} disabled={loading}>Register</button>
            </form>
            <p>Already have an account? Sign in <Link to="/login">here</Link></p>
        </div>
    )
}