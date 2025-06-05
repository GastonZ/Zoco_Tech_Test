import React from 'react'
import RegularInput from './inputs/RegularInput'
import RegularBtn from './buttons/RegularBtn'
import ConfirmModal from './modals/ConfirmModal'
import UseFormState from '../hooks/UseFormState'
import { isEmpty, isTooLong } from '../utils/validations'

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
  const {
    state,
    setField,
  } = UseFormState({
    filter: '',
    showConfirm: false,
    itemToDelete: null,
    inputError: '',
    editErrors: {},
  })

  const handleInputChange = (value) => {
    onInputChange(value)

    if (isEmpty(value)) {
      setField('inputError', 'Este campo no puede estar vacío')
    } else if (isTooLong(value, 50)) {
      setField('inputError', 'Máximo 50 caracteres')
    } else {
      setField('inputError', '')
    }
  }

  const handleEditChange = (id, value) => {
    onEditChange(id, value)

    if (isEmpty(value)) {
      setField('editErrors', { ...state.editErrors, [id]: 'No puede estar vacío' })
    } else if (isTooLong(value, 50)) {
      setField('editErrors', { ...state.editErrors, [id]: 'Máximo 50 caracteres' })
    } else {
      const updated = { ...state.editErrors }
      delete updated[id]
      setField('editErrors', updated)
    }
  }

  const filteredItems = items.filter((item) =>
    item[itemLabel].toLowerCase().includes(state.filter.toLowerCase())
  )

  return (
    <section className="space-y-2 flex flex-col rounded-2xl grow">
      <h3 className="font-semibold text-lg">{title}</h3>

      <RegularInput
        placeholder={`Filtrar ${title.toLowerCase()}...`}
        value={state.filter}
        onChange={(e) => setField('filter', e.target.value)}
        className="mb-2"
      />

      <div className="flex flex-col justify-between h-full">
        <div className="overflow-y-auto max-h-[150px] pr-2">
          <ul className="space-y-2">
            {filteredItems.map((item) => {
              const id = item[itemKey]
              const label = item[itemLabel]
              const currentValue = editValues[id] ?? label
              const changed = currentValue !== label
              const valid = !isEmpty(currentValue)

              return (
                <li key={id} className="flex items-center justify-between gap-2 text-sm border-b border-b-gray-300 pb-2">
                  {editingId === id ? (
                    <div className="flex flex-col gap-2 w-full">
                      <RegularInput
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleEditChange(id, e.target.value)}
                      />
                      {state.editErrors[id] && (
                        <span className="text-xs text-red-500 -mt-1">{state.editErrors[id]}</span>
                      )}
                      <div className="flex gap-2 justify-end">
                        <RegularBtn
                          text="Guardar"
                          onClick={() => onEdit(id)}
                          disabled={!changed || !valid}
                          className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 transition cursor-pointer rounded-lg"
                        />
                        <RegularBtn
                          text="Cancelar"
                          onClick={() => onStartEdit('')}
                          className="text-xs px-2 py-1 bg-gray-300 hover:bg-gray-400 transition cursor-pointer rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate">{label}</span>
                      <RegularBtn
                        text="✏️"
                        onClick={() => onStartEdit(id, label)}
                        className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-sm cursor-pointer transition"
                      />
                      <RegularBtn
                        text="🗑️"
                        onClick={() => {
                          setField('itemToDelete', id)
                          setField('showConfirm', true)
                        }}
                        className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-sm cursor-pointer transition"
                      />
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex gap-2 mt-2 flex-col">
          <RegularInput
            placeholder=""
            label={placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          {state.inputError && (
            <span className="text-xs text-red-500 -mt-1">{state.inputError}</span>
          )}
          <RegularBtn
            text="Agregar"
            onClick={onAdd}
            disabled={addBtnDisabled}
            className="bg-[#F4EC10] hover:bg-yellow-500 rounded-lg py-2 text-lg font-semibold cursor-pointer transition"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={state.showConfirm}
        message="Esta acción es irreversible"
        onConfirm={() => {
          onDelete(state.itemToDelete)
          setField('showConfirm', false)
        }}
        onCancel={() => setField('showConfirm', false)}
      />
    </section>
  )
}

export default UserSection
