import { useContext, useState } from "react"
import { Link } from "react-router"
import CredContext from "../contexts/CredContext"
import ProfileEdit from "../components/ProfileEdit"
import styles from "./Profile.module.css"
import PageContainer from "../components/PageContainer"
import useFetchProfile from "../hooks/useFetchProfile.js"

export default function Profile() {
    const [user, setUser, loading, error] = useFetchProfile();
    const [, , loggedUser] = useContext(CredContext)
    const [isEdit, setIsEdit] = useState(false)

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
                <PageContainer title={"Profile"}>
                    <div className={styles.container}>
                        <div className={styles.details}>
                            <div className={styles.group}>
                                <p>Username</p>
                                <h1>{user?.id}</h1>
                            </div>
                            <div className={styles.nameDescBtn}>
                                <div className={styles.nameDesc}>
                                    {
                                        !isEdit ?
                                            <>
                                                <div className={styles.group}>
                                                    <p>Display Name</p>
                                                    <p>{user?.name}</p>
                                                </div>
                                                <div className={styles.group}>
                                                    <p>Description</p>
                                                    <p>{user?.description || "No Description"}</p>
                                                </div>
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