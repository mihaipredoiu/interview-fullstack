import { useState } from 'react'

import PageHeader from '../../components/PageHeader'
import TextInput from '../../components/TextInput'
import { UsersList } from './UsersList'

import styles from './UsersRoute.module.scss'

export function UsersRoute() {
  const [search, setSearch] = useState('')

  return (
    <>
      <PageHeader title='Users' description='' />
      <div className={styles.content}>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder='Search by name or email…'
          label='Search users'
        />
        <UsersList search={search} />
      </div>
    </>
  )
}
