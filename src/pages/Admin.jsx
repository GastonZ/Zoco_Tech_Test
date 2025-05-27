import { useEffect, useState } from 'react'
import { getAllUsers, getUserProfile, createUser, addStudy, addAddress, updateStudy, removeStudy, updateAddress, removeAddress } from '../api/mockApi'

const Admin = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' })
    const [loading, setLoading] = useState(true)
    const [newStudy, setNewStudy] = useState('')
    const [newAddress, setNewAddress] = useState('')

    const [editingStudyId, setEditingStudyId] = useState(null)
    const [editStudies, setEditStudies] = useState({})
    const [editingAddressId, setEditingAddressId] = useState(null)
    const [editAddresses, setEditAddresses] = useState({})

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) return
        await createUser(newUser)
        setNewUser({ name: '', email: '', password: '', role: 'user' })
        fetchUsers()
    }

    const handleSelectUser = async (email) => {
        const profile = await getUserProfile(email)
        setSelectedUser(profile)
    }

    const handleAddStudyToUser = async () => {
        if (!newStudy.trim()) return
        const updated = await addStudy(selectedUser.id, { title: newStudy })
        setSelectedUser({ ...selectedUser, studies: updated })
        setNewStudy('')
    }

    const handleAddAddressToUser = async () => {
        if (!newAddress.trim()) return
        const updated = await addAddress(selectedUser.id, { location: newAddress })
        setSelectedUser({ ...selectedUser, addresses: updated })
        setNewAddress('')
    }

    const handleUpdateStudy = async (studyId) => {
        const updated = await updateStudy(selectedUser.id, studyId, {
            title: editStudies[studyId],
        })
        setSelectedUser({ ...selectedUser, studies: updated })
        setEditingStudyId(null)
        setEditStudies(prev => ({ ...prev, [studyId]: '' }))
    }

    const handleDeleteStudy = async (studyId) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este estudio?')
        if (!confirmDelete) return

        const updated = await removeStudy(selectedUser.id, studyId)
        setSelectedUser({ ...selectedUser, studies: updated })
    }

    const handleUpdateAddress = async (addressId) => {
        const updated = await updateAddress(selectedUser.id, addressId, {
            location: editAddresses[addressId],
        })
        setSelectedUser({ ...selectedUser, addresses: updated })
        setEditingAddressId(null)
        setEditAddresses((prev) => ({ ...prev, [addressId]: '' }))
    }

    const handleDeleteAddress = async (addressId) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar esta dirección?')
        if (!confirmDelete) return

        const updated = await removeAddress(selectedUser.id, addressId)
        setSelectedUser({ ...selectedUser, addresses: updated })
    }



    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Panel de Administración</h2>

            <div className="p-4 border rounded shadow-md space-y-2">
                <h3 className="font-semibold">Crear nuevo usuario</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    className="border px-2 py-1 rounded w-full"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border px-2 py-1 rounded w-full"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="border px-2 py-1 rounded w-full"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    className="border px-2 py-1 rounded w-full"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <button
                    onClick={handleCreateUser}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                >
                    Crear usuario
                </button>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Usuarios existentes</h3>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <ul className="space-y-2">
                        {users.map((u) => (
                            <li key={u.id} className="flex justify-between items-center border p-2 rounded">
                                <span>{u.name} ({u.role})</span>
                                <button
                                    className="text-blue-600 underline"
                                    onClick={() => handleSelectUser(u.email)}
                                >
                                    Ver detalle
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedUser && (
                <div className="mt-6 p-4 border rounded shadow-md space-y-4">
                    <h3 className="text-lg font-bold">Datos de: {selectedUser.name}</h3>
                    <p>Email: {selectedUser.email}</p>
                    <p>Rol: {selectedUser.role}</p>

                    <div>
                        <h4 className="font-semibold">Estudios:</h4>
                        <ul className="space-y-2 mb-2">
                            {selectedUser.studies.map((s) => {
                                const isEditing = editingStudyId === s.id
                                const currentValue = editStudies[s.id] ?? s.title
                                const isChanged = currentValue !== s.title
                                const isValid = currentValue.trim() !== ""

                                return (
                                    <li key={s.id} className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={currentValue}
                                                    onChange={(e) =>
                                                        setEditStudies((prev) => ({ ...prev, [s.id]: e.target.value }))
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                                <button
                                                    onClick={() => handleUpdateStudy(s.id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                                    disabled={!isChanged || !isValid}
                                                >
                                                    Guardar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-full">{s.title}</span>
                                                <button
                                                    onClick={() => {
                                                        setEditingStudyId(s.id)
                                                        setEditStudies((prev) => ({ ...prev, [s.id]: s.title }))
                                                    }}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudy(s.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                    title="Eliminar"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="border px-2 py-1 rounded w-full"
                                placeholder="Nuevo estudio"
                                value={newStudy}
                                onChange={(e) => setNewStudy(e.target.value)}
                            />
                            <button
                                onClick={handleAddStudyToUser}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                disabled={!newStudy.trim()}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold">Direcciones:</h4>
                        <ul className="space-y-2 mb-2">
                            {selectedUser.addresses.map((a) => {
                                const isEditing = editingAddressId === a.id
                                const currentValue = editAddresses[a.id] ?? a.location
                                const isChanged = currentValue !== a.location
                                const isValid = currentValue.trim() !== ""

                                return (
                                    <li key={a.id} className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={currentValue}
                                                    onChange={(e) =>
                                                        setEditAddresses((prev) => ({
                                                            ...prev,
                                                            [a.id]: e.target.value,
                                                        }))
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                                <button
                                                    onClick={() => handleUpdateAddress(a.id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                                    disabled={!isChanged || !isValid}
                                                >
                                                    Guardar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-full">{a.location}</span>
                                                <button
                                                    onClick={() => {
                                                        setEditingAddressId(a.id)
                                                        setEditAddresses((prev) => ({ ...prev, [a.id]: a.location }))
                                                    }}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(a.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                    title="Eliminar"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="border px-2 py-1 rounded w-full"
                                placeholder="Nueva dirección"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                            />
                            <button
                                onClick={handleAddAddressToUser}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                disabled={!newAddress.trim()}
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Admin
