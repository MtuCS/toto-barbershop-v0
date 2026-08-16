import styles from "./site-atmosphere.module.css"

export function SiteAtmosphere() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.grain} />
    </div>
  )
}
