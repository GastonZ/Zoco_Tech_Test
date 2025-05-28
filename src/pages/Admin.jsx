import { useEffect, useState } from 'react'
import { getAllUsers, getUserProfile, createUser, adminAddStudy, adminUpdateStudy, adminRemoveStudy, adminAddAddress, adminUpdateAddress, adminRemoveAddress } from '../api/mockApi'
import CreateUserForm from '../components/CreateUserForm'
import UserDetailSection from '../components/UserDetailSection'
import RegularBtn from '../components/buttons/RegularBtn'

const Admin = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newUser, setNewUser] = useState({ name: '', email: '', photo: '', password: '', role: 'user' })

    const [editingStudyId, setEditingStudyId] = useState(null)
    const [editStudies, setEditStudies] = useState({})
    const [newStudy, setNewStudy] = useState("")

    const [editingAddressId, setEditingAddressId] = useState(null)
    const [editAddresses, setEditAddresses] = useState({})
    const [newAddress, setNewAddress] = useState("")

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
        if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
            console.error("Faltan datos del usuario")
            return
        }
        await createUser(newUser)
        setNewUser({ name: '', email: '', password: '', role: 'user' })
        fetchUsers()
    }

    const handleChangeNewUser = (updatedUser) => {
        setNewUser(updatedUser)
    }


    const handleSelectUser = (email) => {
        const user = users.find(u => u.email === email)
        setSelectedUser(user)
    }

    const handleAddStudyToUser = async (title) => {
        const updated = await adminAddStudy(selectedUser.id, { title })
        setSelectedUser({ ...selectedUser, studies: updated })
        setNewStudy('')
    }

    const handleUpdateStudy = async (id, title) => {
        const updated = await adminUpdateStudy(selectedUser.id, id, { title })
        setSelectedUser({ ...selectedUser, studies: updated })
        setEditingStudyId(null)
    }

    const handleDeleteStudy = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este estudio?')
        if (!confirmDelete) return
        const updated = await adminRemoveStudy(selectedUser.id, id)
        setSelectedUser({ ...selectedUser, studies: updated })
    }

    const handleAddAddressToUser = async (location) => {
        const updated = await adminAddAddress(selectedUser.id, { location })
        setSelectedUser({ ...selectedUser, addresses: updated })
        setNewAddress('')
    }

    const handleUpdateAddress = async (id, location) => {
        const updated = await adminUpdateAddress(selectedUser.id, id, { location })
        setSelectedUser({ ...selectedUser, addresses: updated })
        setEditingAddressId(null)
    }

    const handleDeleteAddress = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar esta dirección?')
        if (!confirmDelete) return
        const updated = await adminRemoveAddress(selectedUser.id, id)
        setSelectedUser({ ...selectedUser, addresses: updated })
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Panel de Administración</h2>

            <CreateUserForm
                initialUser={newUser}
                onChange={handleChangeNewUser}
                onSubmit={handleCreateUser}
            />

            <div>
                <h3 className="font-semibold mb-2">Usuarios existentes</h3>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <ul className="space-y-2">
                        {users.map((u) => (
                            <li key={u.id} className="flex justify-between items-center border p-2 rounded">
                                <span>{u.name} ({u.role})</span>
                                <RegularBtn
                                    className={"text-blue-600 underline"}
                                    onClick={() => handleSelectUser(u.email)}
                                    text={'Ver detalle'}
                                />
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

                    <UserDetailSection
                        title="Estudios"
                        items={selectedUser.studies}
                        fieldName="title"
                        placeholder="Nuevo estudio"
                        onAdd={() => handleAddStudyToUser(newStudy)}
                        onUpdate={(id) => handleUpdateStudy(id, editStudies[id])}
                        onDelete={handleDeleteStudy}
                        editingId={editingStudyId}
                        setEditingId={setEditingStudyId}
                        editMap={editStudies}
                        setEditMap={setEditStudies}
                        inputValue={newStudy}
                        setInputValue={setNewStudy}
                    />

                    <UserDetailSection
                        title="Direcciones"
                        items={selectedUser.addresses}
                        fieldName="location"
                        placeholder="Nueva dirección"
                        onAdd={() => handleAddAddressToUser(newAddress)}
                        onUpdate={(id) => handleUpdateAddress(id, editAddresses[id])}
                        onDelete={handleDeleteAddress}
                        editingId={editingAddressId}
                        setEditingId={setEditingAddressId}
                        editMap={editAddresses}
                        setEditMap={setEditAddresses}
                        inputValue={newAddress}
                        setInputValue={setNewAddress}
                    />
                </div>
            )}
        </div>
    )
}

export default Admin