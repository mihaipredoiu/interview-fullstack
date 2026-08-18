import PageHeader from '../../components/PageHeader'
import { TaskList } from './TaskList'

// -------------------------------------------------------------------------- //

export function TaskListRoute() {
  return (
    <>
      <PageHeader
        title='Tasks'
        description='Build a component that lists tasks, filters them by status and shows a small summary.'
      />
      <TaskList />
    </>
  )
}
