import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

import { ApplicationsRoute } from './exercises/applications/ApplicationsRoute'
import { DevicesRoute } from './exercises/devices/DevicesRoute'
import { TaskListRoute } from './exercises/task-list/TaskListRoute'
import { UsersRoute } from './exercises/users/UsersRoute'

import styles from './App.module.scss'

// -------------------------------------------------------------------------- //

const NAV_ITEMS = [
  { to: '/tasks', label: 'Tasks ' },
  { to: '/applications', label: 'Applications' },
  { to: '/users', label: 'Users' },
  { to: '/devices', label: 'Devices' },
]

export function App() {
  return (
    <div className={styles.App}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className={styles.main}>
        <Routes>
          <Route path='/' element={<Navigate to='/tasks' replace />} />
          <Route path='/tasks' element={<TaskListRoute />} />
          <Route path='/applications' element={<ApplicationsRoute />} />
          <Route path='/users' element={<UsersRoute />} />
          <Route path='/devices' element={<DevicesRoute />} />
        </Routes>
      </main>
    </div>
  )
}
