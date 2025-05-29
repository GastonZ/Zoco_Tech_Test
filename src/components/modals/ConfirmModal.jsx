import React from 'react'
import ReactDOM from 'react-dom'

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-center space-y-4">
                <h3 className="text-lg font-semibold">¿Estás seguro?</h3>
                <p>{message || 'Esta acción no se puede deshacer.'}</p>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal