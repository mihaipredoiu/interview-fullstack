import styles from './index.module.scss'

// -------------------------------------------------------------------------- //

export type DropdownOption<T> = {
  label: string
  value: T
  disabled?: boolean
}

export interface IDropdownProps<T> {
  options: DropdownOption<T>[]
  /** The currently selected value. */
  selected: T
  onChange: (value: T) => void
  /** Accessible label, also rendered as the field's aria-label. */
  label?: string
}

/**
 * Dropdown
 *
 * Generic single-select. Values are matched by their string representation, so
 * any value type that stringifies uniquely works.
 */
export function Dropdown<T extends string | number>(
  props: Readonly<IDropdownProps<T>>,
) {
  const { options, selected, onChange, label } = props

  return (
    <select
      className={styles.Dropdown}
      aria-label={label}
      value={String(selected)}
      onChange={(event) => {
        const option = options.find(
          (item) => String(item.value) === event.target.value,
        )
        if (option) {
          onChange(option.value)
        }
      }}
    >
      {options.map((option) => (
        <option
          key={String(option.value)}
          value={String(option.value)}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
