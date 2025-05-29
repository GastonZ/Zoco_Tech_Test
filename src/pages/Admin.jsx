import { useEffect, useState } from 'react'
import { getAllUsers, getUserProfile, createUser, adminAddStudy, adminUpdateStudy, adminRemoveStudy, adminAddAddress, adminUpdateAddress, adminRemoveAddress } from '../api/mockApi'
import CreateUserForm from '../components/CreateUserForm'
import UserDetailSection from '../components/UserDetailSection'
import RegularBtn from '../components/buttons/RegularBtn'
import { toastError, toastSuccess } from '../utils/toasts'
import { isEmpty, isValidEmail, isTooLong } from '../utils/validations'

const Admin = () => {
    const [user, setUser] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newUser, setNewUser] = useState({ name: '', email: '', photo: '', password: '', role: 'user' })
    const [profile, setProfile] = useState(null)
    const [profileData, setProfileData] = useState({ name: '', photo: '' })

    const [editingStudyId, setEditingStudyId] = useState(null)
    const [editStudies, setEditStudies] = useState({})
    const [newStudy, setNewStudy] = useState("")

    const [editingAddressId, setEditingAddressId] = useState(null)
    const [editAddresses, setEditAddresses] = useState({})
    const [newAddress, setNewAddress] = useState("")

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(user.email)
                setProfileData({ name: data.name, photo: data.photo })
                setProfile(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user.email])

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
        const { name, email, password, role } = newUser

        if (isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(role)) return toastError("Faltan datos del usuario")

        if (!isValidEmail(email)) return toastError("Email inválido")

        if (isTooLong(name, 50)) return toastError("El nombre es demasiado largo (máx. 50 caracteres)")

        try {
            await createUser(newUser)
            setNewUser({ name: '', email: '', password: '', photo: '', role: 'user' })
            fetchUsers()
            toastSuccess("Usuario creado exitosamente!")
        } catch (err) {
            toastError(`Error al crear usuario: ${err}`)
        }
    }


    const handleChangeNewUser = (updatedUser) => {
        setNewUser(updatedUser)
    }


    const handleSelectUser = (email) => {
        const user = users.find(u => u.email === email)
        setSelectedUser(user)
    }

    const handleAddStudyToUser = async (title) => {
        if (isEmpty(title)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(title, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        try {
            const updated = await adminAddStudy(selectedUser.id, { title })
            setSelectedUser({ ...selectedUser, studies: updated })
            setNewStudy('')
            toastSuccess("Estudio agregado!")
        } catch (err) {
            toastError(`Error al agregar estudio: ${err}`)
        }
    }


    const handleUpdateStudy = async (id, title) => {
        if (isEmpty(title)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(title, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        try {
            const updated = await adminUpdateStudy(selectedUser.id, id, { title })
            setSelectedUser({ ...selectedUser, studies: updated })
            setEditingStudyId(null)
            toastSuccess("Estudio actualizado!")
        } catch (err) {
            toastError(`Error al actualizar estudio: ${err}`)
        }
    }


    const handleDeleteStudy = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar este estudio?')
        if (!confirmDelete) return
        try {
            const updated = await adminRemoveStudy(selectedUser.id, id)
            setSelectedUser({ ...selectedUser, studies: updated })
            toastSuccess("Estudio eliminado!")
        } catch (err) {
            toastError(`Error al eliminar estudio: ${err}`)
        }
    }


    const handleAddAddressToUser = async (location) => {
        if (isEmpty(location)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(location, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        try {
            const updated = await adminAddAddress(selectedUser.id, { location })
            setSelectedUser({ ...selectedUser, addresses: updated })
            setNewAddress('')
            toastSuccess("Dirección agregada!")
        } catch (err) {
            toastError(`Error al agregar dirección: ${err}`)
        }
    }


    const handleUpdateAddress = async (id, location) => {
        if (isEmpty(location)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(location, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        try {
            const updated = await adminUpdateAddress(selectedUser.id, id, { location })
            setSelectedUser({ ...selectedUser, addresses: updated })
            setEditingAddressId(null)
            toastSuccess("Dirección actualizada!")
        } catch (err) {
            toastError(`Error al actualizar dirección: ${err}`)
        }
    }

    const handleDeleteAddress = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de eliminar esta dirección?')
        if (!confirmDelete) return
        try {
            const updated = await adminRemoveAddress(selectedUser.id, id)
            setSelectedUser({ ...selectedUser, addresses: updated })
            toastSuccess("Dirección eliminada!")
        } catch (err) {
            toastError(`Error al eliminar dirección: ${err}`)
        }
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-yellow-300 text-xl font-semibold animate-pulse">
                    Cargando perfil...
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:flex md:gap-6 min-h-screen max-w-6xl w-full justify-center mx-auto">

            <aside className="bg-[#EEEDE4] p-4 rounded-xl w-full md:max-w-[250px] max-h-[400px] flex flex-col items-center text-center">
                {profile && (
                    <>
                        <img
                            src={profile.photo}
                            alt="Admin"
                            className="h-[100x] w-[150px] rounded-full object-cover mb-4"
                        />
                        <h2 className="font-bold text-lg">{profile.name}</h2>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Rol: {profile.role}</p>
                    </>
                )}
            </aside>
            <div className="flex-1 space-y-6 mt-6 md:mt-0">
                <h2 className="text-2xl font-bold text-[#EEEDE4]">Panel de Administración</h2>
                <CreateUserForm
                    initialUser={newUser}
                    onChange={handleChangeNewUser}
                    onSubmit={handleCreateUser}
                />
                <div className="bg-[#EEEDE4] p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Usuarios existentes</h3>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((u) => (
                                <li key={u.id} className={`flex justify-between items-center transition ${selectedUser?.id === u.id ? 'border border-yellow-300 scale-[102%]' : 'border'}  p-2 rounded`}>
                                    <span>{u.name} ({u.role})</span>
                                    <RegularBtn
                                        className={"bg-yellow-300 p-1 rounded-sm text-sm font-semibold hover:bg-yellow-500 transition cursor-pointer"}
                                        onClick={() => handleSelectUser(u.email)}
                                        text={'Administrar'}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedUser && (
                    <div className="p-4 border shadow-md space-y-4 bg-[#EEEDE4] rounded-xl">
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
        </div>
    )
}

export default Admin