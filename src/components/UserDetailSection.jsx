import React, { useState } from 'react'
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

    const [filter, setFilter] = useState("")

    const filteredItems = items.filter(item =>
        item[fieldName].toLowerCase().includes(filter.toLowerCase())
    )


    return (
        <div>
            <h4 className="font-semibold ">{title}</h4>

            <RegularInput
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={`Buscar ${title.toLowerCase()}`}
            />
            <div className='h-[20px]' />
            <ul className="font-semibold overflow-y-auto max-h-[200px] pr-2">
                {filteredItems.map((item) => {
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
                                        className="bg-green-400 text-white px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:bg-green-500 transition"
                                        disabled={!isChanged || !isValid}
                                        text={'👌'}
                                    />
                                    <RegularBtn
                                        onClick={() => setEditingId('')}
                                        className="bg-red-300 text-black px-3 py-1 rounded disabled:opacity-50 cursor-pointer hover:bg-red-400 transition"
                                        text={'Cancelar'}
                                    />
                                </>
                            ) : (
                                <div className='flex items-center w-full justify-between gap-10 border-b border-gray-300 pb-2'>
                                    <span className="">{item[fieldName]}</span>
                                    <div className='flex gap-2'>
                                        <RegularBtn
                                            onClick={() => {
                                                setEditingId(item.id)
                                                setEditMap((prev) => ({ ...prev, [item.id]: item[fieldName] }))
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600 transition"
                                            text={"✏️"}
                                        />
                                        <RegularBtn
                                            onClick={() => onDelete(item.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 transition"
                                            text="🗑️"
                                        />
                                    </div>
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
            <div className="flex gap-2 mt-6">
                <RegularInput
                    value={inputValue}

                    label={placeholder}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <RegularBtn
                    onClick={onAdd}
                    className={"bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer text-black font-semibold px-3 py-1 rounded"}
                    disabled={!inputValue?.trim()}
                    text={'Agregar'}
                />
            </div>
        </div>
    )
}

export default UserDetailSection;