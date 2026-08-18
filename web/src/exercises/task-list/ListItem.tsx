import { X } from 'lucide-react'

import { Task } from './data'

import styles from './ListItem.module.scss'

// -------------------------------------------------------------------------- //

type IListItemProps = Task & {
  /** Called with the task id when the remove (X) button is pressed. */
  onRemove?: (id: number) => void
}

/**
 * List Item
 *
 * Renders a single task row with its details (title, assignee, status,
 * priority, estimated hours) and a button to remove it from the list.
 */
export function ListItem(props: Readonly<IListItemProps>) {
  const { id, title, assignee, status, estimatedHours, onRemove } = props

  return (
    <li className={styles.ListItem}>
      <div className={styles.main}>
        <span className={styles.title}>{title}</span>
        <span className={styles.assignee}>{assignee}</span>
      </div>
      <div className={styles.meta}>
        <span>{status}</span>
        <span>•</span>
        <span>{estimatedHours}h</span>
        {onRemove ? (
          <button
            type='button'
            className={styles.remove}
            aria-label={`Remove ${title}`}
            onClick={() => onRemove(id)}
          >
            <X />
          </button>
        ) : null}
      </div>
    </li>
  )
}
