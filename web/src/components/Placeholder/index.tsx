import { Inbox, TriangleAlert } from 'lucide-react'

import styles from './index.module.scss'

// -------------------------------------------------------------------------- //

export interface IPlaceholderProps {
  type: 'nodata' | 'error'
  title: string
  text?: string
}

/** Empty / error state block. */
export function Placeholder(props: Readonly<IPlaceholderProps>) {
  const { type, title, text } = props
  const Icon = type === 'error' ? TriangleAlert : Inbox

  return (
    <div className={styles.Placeholder} role='status'>
      <Icon />
      <span className={styles.title}>{title}</span>
      {text ? <span className={styles.text}>{text}</span> : null}
    </div>
  )
}

export default Placeholder
