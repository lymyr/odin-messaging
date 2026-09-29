import { Outlet, useNavigate, useSearchParams } from "react-router";
import Header from "./components/Header";
import CredContext from "./contexts/CredContext.js"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SearchParamContext from "./contexts/SearchParamContext.js";

function App() {
  const nav = useNavigate()
  const [user, setUser] = useState()
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [searchParams, setSearchParams] = useSearchParams(location.search)

  useEffect(() => {
    let timeoutId;
    if (!token)
      nav("/login")
    else {
      const decoded = jwtDecode(token)
      timeoutId = setTimeout(() => {
        localStorage.removeItem("token")
        setToken()
      }, (decoded.exp*1000) - Date.now())
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(decoded)
      localStorage.setItem("token", token)
    }
    return () => clearTimeout(timeoutId)
  }, [token, nav])

  return (
    <>
    <CredContext value={[token, setToken, user, setUser]}>
      <SearchParamContext value={[searchParams, setSearchParams]}>
        <Header />
        <Outlet />
      </SearchParamContext>
    </CredContext>
    </>
  )
}

export default App
