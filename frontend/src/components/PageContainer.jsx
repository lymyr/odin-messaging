import styles from "./PageContainer.module.css"

export default function PageContainer({title, children}) {
    return (
        <div className={styles.page}>
            {title && <div className={styles.title}><h1>{title}</h1></div>}
            <div className={styles.content}>{children}</div>
        </div>
    )
}