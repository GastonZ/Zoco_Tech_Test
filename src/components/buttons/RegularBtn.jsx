import React from 'react'

const RegularBtn = ({
  onClick,
  type = 'button',
  text,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Cargando...' : text}
    </button>
  )
}

export default RegularBtn;