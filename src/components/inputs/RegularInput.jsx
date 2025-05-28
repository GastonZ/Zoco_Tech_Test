import React from 'react'
import styles from './style.module.css'

const RegularInput = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  className,
  name,
  placeholder,
}) => {
  return (
    <div className={styles.input_container}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={styles.input_field}
        value={value}
        onChange={onChange}
        required={required}
      />
      <label className={styles.input_label}>{label}</label>
      <span className={styles.input_highlight}></span>
    </div>
  )
}

export default RegularInput;