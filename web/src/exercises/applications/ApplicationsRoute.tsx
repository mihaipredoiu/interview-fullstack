import PageHeader from '../../components/PageHeader'
import { ApplicationsTable } from './ApplicationsTable'

import styles from './ApplicationsRoute.module.scss'

// -------------------------------------------------------------------------- //

export function ApplicationsRoute() {
  return (
    <>
      <PageHeader
        title='Applications'
        description='Server-driven listing: pagination, filtering, search and sorting all happen in the API.'
      />
      <div className={styles.content}>
        <ApplicationsTable />
      </div>
    </>
  )
}
