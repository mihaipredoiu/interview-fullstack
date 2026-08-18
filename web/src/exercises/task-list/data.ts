// Do NOT change the shape of the data - build the UI around it.

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: number
  title: string
  assignee: string
  status: TaskStatus
  priority: TaskPriority
  estimatedHours: number
}

/** The status filter value - the extra `'all'` option shows every task. */
export type StatusFilter = TaskStatus | 'all'

export const tasks: Task[] = [
  {
    id: 1,
    title: 'Fix login bug',
    assignee: 'Ana',
    status: 'todo',
    priority: 'high',
    estimatedHours: 3,
  },
  {
    id: 2,
    title: 'Create dashboard filters',
    assignee: 'Mihai',
    status: 'in_progress',
    priority: 'medium',
    estimatedHours: 5,
  },
  {
    id: 3,
    title: 'Refactor table component',
    assignee: 'Ana',
    status: 'done',
    priority: 'medium',
    estimatedHours: 8,
  },
  {
    id: 4,
    title: 'Add empty state',
    assignee: 'Radu',
    status: 'todo',
    priority: 'low',
    estimatedHours: 2,
  },
  {
    id: 5,
    title: 'Improve error handling',
    assignee: 'Mihai',
    status: 'done',
    priority: 'high',
    estimatedHours: 4,
  },
]
