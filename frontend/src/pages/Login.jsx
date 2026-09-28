import { useState } from "react";
import InputLabel from "../components/InputLabel";
import { Link } from "react-router";

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <InputLabel label={"username"} formData={formData} setFormData={setFormData}/>
                </div>
                <div>
                    <InputLabel label={"password"} type={"password"} formData={formData} setFormData={setFormData}/>
                </div>
                <button>Log in</button>
            </form>
            <p>No account? Register <Link to="/register">here</Link></p>
        </div>
    )
}