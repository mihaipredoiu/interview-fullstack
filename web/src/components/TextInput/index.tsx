import styles from './index.module.scss'

// -------------------------------------------------------------------------- //

export interface ITextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

/** Uncontrolled-looking, fully controlled text input. */
export function TextInput(props: Readonly<ITextInputProps>) {
  const { value, onChange, placeholder, label } = props

  return (
    <input
      type='text'
      className={styles.TextInput}
      value={value}
      aria-label={label}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default TextInput
