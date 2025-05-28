import React from 'react'

const RegularBtn = ({
  onClick,
  type = 'button',
  text,
  disabled = false,
  className,
  loading = false,
}) => {
  const baseClass = 'disabled:opacity-50'
  const defaultClass = 'w-full bg-[#F4EC10] text-black py-2 rounded hover:bg-yellow-500 cursor-pointer transition text-lg font-semibold'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className || defaultClass}`}
    >
      {loading ? 'Cargando...' : text}
    </button>
  )
}

export default RegularBtn
