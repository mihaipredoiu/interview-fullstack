import styles from './index.module.scss'

// -------------------------------------------------------------------------- //

export interface IPageHeaderProps {
  title: string
  description?: string
}

/** Page title + one-liner. */
export function PageHeader(props: Readonly<IPageHeaderProps>) {
  const { title, description } = props

  return (
    <header className={styles.PageHeader}>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </header>
  )
}

export default PageHeader
