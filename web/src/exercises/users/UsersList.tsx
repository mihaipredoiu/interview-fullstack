// -------------------------------------------------------------------------- //
//
// Exercise 3. This page shipped broken - open http://localhost:5173/users and
// look at the console while it runs.
//
// First, find and fix whatever makes the page work chaotic.
//
// The endpoint is `GET /api/users?q=<text>` and the backend is fine; do not
// change it. The rest of the repo (src/api, src/components) is fair game.
//
// -------------------------------------------------------------------------- //

import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  team: string
  role: string
}

export function UsersList({ search }: { search: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [isSorted, setIsSorted] = useState(false)
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    fetch(`/api/users?q=${search}`)
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
  }, [search, users])

  const visible = isSorted
    ? [...users].sort((a, b) => a.name.localeCompare(b.name))
    : users

  function toggleSelected(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const allSelected =
    visible.length > 0 && visible.every((user) => selected.includes(user.id))

  function toggleSelectAll() {
    if (allSelected) {
      for (const user of visible) {
        setSelected(selected.filter((s) => s !== user.id))
      }
    } else {
      for (const user of visible) {
        if (!selected.includes(user.id)) {
          setSelected([...selected, user.id])
        }
      }
    }
  }

  return (
    <>
      <button type='button' onClick={() => setIsSorted(!isSorted)}>
        {isSorted ? 'Directory order' : 'Sort A-Z'}
      </button>
      <button type='button' onClick={toggleSelectAll}>
        {allSelected ? 'Unselect all' : 'Select all'}
      </button>
      <ul>
        {visible.map((user, index) => (
          <li key={index}>
            <input
              type='checkbox'
              checked={selected.includes(user.id)}
              onChange={() => toggleSelected(user.id)}
              aria-label='Select user'
            />
            <input defaultValue={user.name} aria-label='Name' />
            <span>
              {user.email} ({user.team}, {user.role})
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
