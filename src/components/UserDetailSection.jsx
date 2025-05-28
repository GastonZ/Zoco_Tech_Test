import React from 'react'
import RegularInput from './inputs/RegularInput'
import RegularBtn from './buttons/RegularBtn'

const UserDetailSection = ({
    title,
    items,
    onAdd,
    onUpdate,
    onDelete,
    editingId,
    setEditingId,
    editMap,
    setEditMap,
    inputValue,
    setInputValue,
    fieldName,
    placeholder,
}) => {
    return (
        <div>
            <h4 className="font-semibold">{title}</h4>
            <ul className="space-y-2 mb-2">
                {items.map((item) => {
                    const isEditing = editingId === item.id
                    const currentValue = typeof editMap[item.id] === 'string'
                        ? editMap[item.id]
                        : item[fieldName]

                    const isChanged = currentValue !== item[fieldName]
                    const isValid = currentValue.trim() !== ""

                    return (
                        <li key={item.id} className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <RegularInput
                                        value={currentValue}
                                        onChange={(e) =>
                                            setEditMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                                        }
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                    <RegularBtn
                                        onClick={() => onUpdate(item.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                        disabled={!isChanged || !isValid}
                                        text={'Guardar'}
                                    />
                                    <RegularBtn
                                        onClick={() => setEditingId('')}
                                        className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                        text={'Cancelar'}
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="w-full">{item[fieldName]}</span>
                                    <RegularBtn
                                        onClick={() => {
                                            setEditingId(item.id)
                                            setEditMap((prev) => ({ ...prev, [item.id]: item[fieldName] }))
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        text={'Editar'}
                                    />
                                    <RegularBtn
                                        onClick={() => onDelete(item.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        text={'x'}
                                    />
                                </>
                            )}
                        </li>
                    )
                })}
            </ul>
            <div className="flex gap-2">
                <RegularInput
                    value={inputValue}
                    placeholder={placeholder}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <RegularBtn
                    onClick={onAdd}
                    className={"bg-blue-600 text-white px-3 py-1 rounded"}
                    disabled={!inputValue?.trim()}
                    text={'Agregar'}
                />
            </div>
        </div>
    )
}

export default UserDetailSection;