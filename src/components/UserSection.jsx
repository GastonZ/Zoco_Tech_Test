import React from 'react'
import RegularInput from './inputs/RegularInput'
import RegularBtn from './buttons/RegularBtn'

const UserSection = ({
  title,
  items,
  isEditing,
  editingId,
  editValues,
  onEditChange,
  onEdit,
  onDelete,
  onStartEdit,
  inputValue,
  onInputChange,
  onAdd,
  addBtnDisabled,
  placeholder,
  itemKey = 'id',
  itemLabel = 'title',
}) => {
  return (
    <section className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => {
          const id = item[itemKey]
          const label = item[itemLabel]
          const currentValue = editValues[id] ?? label
          const changed = currentValue !== label
          const valid = currentValue.trim() !== ''

          return (
            <li key={id} className="flex items-center gap-2">
              {editingId === id ? (
                <div className='flex flex-col gap-4'>
                  <RegularInput
                    type="text"
                    value={currentValue}
                    onChange={(e) => onEditChange(id, e.target.value)}
                  />
                  <div className='flex gap-4 justify-center'>

                    <RegularBtn
                      text="Guardar"
                      onClick={() => onEdit(id)}
                      disabled={!changed || !valid}
                    />
                    <RegularBtn
                      text="Cancelar"
                      onClick={() => onStartEdit('')}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span className="w-full">{label}</span>
                  <RegularBtn
                    text="Editar"
                    onClick={() => onStartEdit(id, label)}
                  />
                  <RegularBtn
                    text="×"
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar?')) onDelete(id)
                    }}
                  />
                </>
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex gap-2 mt-2 flex-col">
        <RegularInput
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <RegularBtn
          text="Agregar"
          onClick={onAdd}
          disabled={addBtnDisabled}
        />
      </div>
    </section>
  )
}

export default UserSection
