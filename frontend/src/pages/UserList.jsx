import { Link } from "react-router";
import styles from "./UserList.module.css"
import PageContainer from "../components/PageContainer";
import useFetchUsers from "../hooks/useFetchUsers";

export default function UserList() {
    const [users, error, loading] = useFetchUsers()

    return (
        <>
            {
                loading ?
                    <div className={styles.infoContainer}>
                        <div className={styles.loading}></div>
                        <p>Fetching users...</p>
                    </div> 
                : error ?
                    <div className={styles.infoContainer}>
                        <h1 className={styles.pageText}>{error}</h1>
                    </div>
                : users.length == 0 ?
                    <div className={styles.infoContainer}>
                        <h1 className={styles.pageText}>No user found</h1>
                    </div>
                : 
                    <PageContainer  title={"User List"}>
                        {
                            users.map(u => {
                                return (
                                    <Link to={`/users/${u.id}`} key={u.id}>
                                        <div className={styles.container}>
                                            <div>
                                                <p>Display Name</p>
                                                <p>{u.name}</p>
                                            </div>
                                            <div>
                                                <p>Username</p>
                                                <p>{u.id}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </PageContainer>   
            }
        </>
    )
}