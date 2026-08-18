import Dropdown, { DropdownOption } from '../../components/Dropdown'
import { StatusFilter } from './data'

import styles from './TaskList.module.scss'

// -------------------------------------------------------------------------- //
//
// Exercise 1 - build a component that displays a list of tasks.
//
// Requirements (each maps to a TODO(n) in the code below):
//   1. Render the tasks list using the <ListItem /> component.
//   2. Filter the list items based on the status dropdown's selection.
//   3. Render a task summary: total tasks, total shown and total estimated time.
//   4. Each <ListItem /> has an onRemove prop. When the user presses the X
//      button, that task should disappear from the list.
//   5. Keep the filter persistent so the selection remains after a refresh.
//   6. Pressing the Escape key anywhere resets the filter to "all".
//
// The dataset and types live in `./data` - import from there, do not redefine them.
// Basic styles are available in `TaskList.module.scss` (feel free to extend them).
//
// -------------------------------------------------------------------------- //

const STATUS_FILTER_OPTIONS: DropdownOption<StatusFilter>[] = [
  { label: 'All', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

export function TaskList() {
  // TODO(5): Keep the filter persistent so the selection remains after a refresh.

  // TODO(6): Pressing the Escape key anywhere resets the filter to "all".

  return (
    <div className={styles.TaskList}>
      {/* TODO(2): Filter the list items based on this dropdown's selection. */}
      <div className={styles.filter}>
        <span>Status</span>
        <Dropdown
          label='Status'
          options={STATUS_FILTER_OPTIONS}
          selected='all'
          onChange={() => {}}
        />
      </div>

      {/* TODO(3): Render a task summary: total tasks, total shown and total estimated time. */}

      {/* TODO(4): Each <ListItem /> has an onRemove prop. When the user presses the X button, that task should disappear from the list. */}

      {/* TODO(1): Render the tasks list using the <ListItem /> component. */}
    </div>
  )
}
