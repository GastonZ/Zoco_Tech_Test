import React from 'react'

const RegularInput = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  name,
  placeholder,
}) => {
  return (
    <div>
      {label && <label className="block mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default RegularInput;