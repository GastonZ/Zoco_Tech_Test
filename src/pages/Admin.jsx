import { useEffect } from 'react'
import {
    getAllUsers, getUserProfile, createUser,
    adminAddStudy, adminUpdateStudy, adminRemoveStudy,
    adminAddAddress, adminUpdateAddress, adminRemoveAddress
} from '../api/mockApi'
import CreateUserForm from '../components/CreateUserForm'
import UserDetailSection from '../components/UserDetailSection'
import RegularBtn from '../components/buttons/RegularBtn'
import { toastError, toastSuccess } from '../utils/toasts'
import { isEmpty, isValidEmail, isTooLong } from '../utils/validations'
import ConfirmModal from '../components/modals/ConfirmModal'
import LogoutBtn from '../components/buttons/LogoutBtn'
import UseFormState from '../hooks/UseFormState'

const Admin = () => {
    const {
        state,
        setField,
        resetField,
        setLoadingRequest,
    } = UseFormState({
        user: [],
        users: [],
        selectedUser: null,
        newUser: { name: '', email: '', photo: '', password: '', role: 'user' },
        profile: null,
        profileData: { name: '', photo: '' },
        loading: true,
        editingStudyId: null,
        editStudies: {},
        newStudy: "",
        editingAddressId: null,
        editAddresses: {},
        newAddress: "",
        showConfirm: false,
        itemToDelete: null,
        deleteType: null,
        loadingRequest: false
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(state.user.email)
                setField('profileData', { name: data.name, photo: data.photo })
                setField('profile', data)
            } catch (err) {
                console.error(err)
            } finally {
                setField('loading', false)
            }
        }
        fetchProfile()
    }, [state.user.email])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setField('loading', true)
        try {
            const data = await getAllUsers()
            setField('users', data)
        } catch (err) {
            console.error(err)
        } finally {
            setField('loading', false)
        }
    }

    const handleCreateUser = async () => {
        const { name, email, password, role } = state.newUser

        if (isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(role)) return toastError("Faltan datos del usuario")
        if (!isValidEmail(email)) return toastError("Email inválido")
        if (isTooLong(name, 50)) return toastError("El nombre es demasiado largo (máx. 50 caracteres)")

        try {
            setLoadingRequest(true)
            await createUser(state.newUser)
            setField('newUser', { name: '', email: '', password: '', photo: '', role: 'user' })
            fetchUsers()
            toastSuccess("Usuario creado exitosamente!")
        } catch (err) {
            toastError(`Error al crear usuario: ${err}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleChangeNewUser = (updatedUser) => {
        setField('newUser', updatedUser)
    }

    const handleSelectUser = (email) => {
        const selected = state.users.find(u => u.email === email)
        setField('selectedUser', selected)
    }

    const handleAddStudyToUser = async (title) => {
        if (isEmpty(title)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(title, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await adminAddStudy(state.selectedUser.id, { title })
            setField('selectedUser', { ...state.selectedUser, studies: updated })
            resetField('newStudy')
            toastSuccess("Estudio agregado!")
        } catch (err) {
            toastError(`Error al agregar estudio: ${err}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleUpdateStudy = async (id, title) => {
        if (isEmpty(title)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(title, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await adminUpdateStudy(state.selectedUser.id, id, { title })
            setField('selectedUser', { ...state.selectedUser, studies: updated })
            resetField('editingStudyId')
            toastSuccess("Estudio actualizado!")
        } catch (err) {
            toastError(`Error al actualizar estudio: ${err}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleAddAddressToUser = async (location) => {
        if (isEmpty(location)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(location, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await adminAddAddress(state.selectedUser.id, { location })
            setField('selectedUser', { ...state.selectedUser, addresses: updated })
            resetField('newAddress')
            toastSuccess("Dirección agregada!")
        } catch (err) {
            toastError(`Error al agregar dirección: ${err}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleUpdateAddress = async (id, location) => {
        if (isEmpty(location)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(location, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await adminUpdateAddress(state.selectedUser.id, id, { location })
            setField('selectedUser', { ...state.selectedUser, addresses: updated })
            resetField('editingAddressId')
            toastSuccess("Dirección actualizada!")
        } catch (err) {
            toastError(`Error al actualizar dirección: ${err}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleDeleteRequest = (id, type) => {
        setField('itemToDelete', id)
        setField('deleteType', type)
        setField('showConfirm', true)
        setLoadingRequest(true)
    }

    const handleConfirmDelete = async () => {
        try {
            if (state.deleteType === 'study') {
                const updated = await adminRemoveStudy(state.selectedUser.id, state.itemToDelete)
                setField('selectedUser', { ...state.selectedUser, studies: updated })
                toastSuccess("Estudio eliminado!")
            } else if (state.deleteType === 'address') {
                const updated = await adminRemoveAddress(state.selectedUser.id, state.itemToDelete)
                setField('selectedUser', { ...state.selectedUser, addresses: updated })
                toastSuccess("Dirección eliminada!")
            }
        } catch (err) {
            toastError(`Error al eliminar ${state.deleteType}: ${err}`)
        } finally {
            setField('showConfirm', false)
            resetField('itemToDelete')
            resetField('deleteType')
            setLoadingRequest(false)
        }
    }

    if (state.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-yellow-300 text-xl font-semibold animate-pulse">
                    Cargando perfil...
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-end p-4">
                <LogoutBtn />
            </div>
            <div className="p-6 md:flex md:gap-6 min-h-screen max-w-6xl w-full justify-center mx-auto">
                <aside className="bg-[#EEEDE4] p-4 rounded-xl w-full md:max-w-[250px] max-h-[400px] flex flex-col items-center text-center">
                    {state.profile && (
                        <>
                            <img
                                src={state.profile.photo}
                                alt="Admin"
                                className="h-[100x] w-[150px] rounded-full object-cover mb-4"
                            />
                            <h2 className="font-bold text-lg">{state.profile.name}</h2>
                            <p className="text-sm text-gray-600">{state.profile.email}</p>
                            <p className="text-sm text-gray-500 mt-1">Rol: {state.profile.role}</p>
                        </>
                    )}
                </aside>

                <div className="flex-1 space-y-6 mt-6 md:mt-0">
                    <h2 className="text-2xl font-bold text-[#EEEDE4]">Panel de Administración</h2>

                    <CreateUserForm
                        initialUser={state.newUser}
                        onChange={handleChangeNewUser}
                        onSubmit={handleCreateUser}
                        sendingRequest={state.loadingRequest}
                    />

                    <div className="bg-[#EEEDE4] p-6 rounded-xl">
                        <h3 className="font-semibold mb-2">Usuarios existentes</h3>
                        {state.loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <ul className="space-y-2">
                                {state.users.map((u) => (
                                    <li key={u.id} className={`flex justify-between items-center transition ${state.selectedUser?.id === u.id ? 'border border-yellow-300 scale-[102%]' : 'border'} p-2 rounded`}>
                                        <span>{u.name} ({u.role})</span>
                                        <RegularBtn
                                            className="bg-yellow-300 p-1 rounded-sm text-sm font-semibold hover:bg-yellow-500 transition cursor-pointer"
                                            onClick={() => handleSelectUser(u.email)}
                                            text="Administrar"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {state.selectedUser && (
                        <div className="p-4 border shadow-md space-y-4 bg-[#EEEDE4] rounded-xl">
                            <h3 className="text-lg font-bold">Datos de: {state.selectedUser.name}</h3>
                            <p>Email: {state.selectedUser.email}</p>
                            <p>Rol: {state.selectedUser.role}</p>

                            <UserDetailSection
                                title="Estudios"
                                items={state.selectedUser.studies}
                                fieldName="title"
                                placeholder="Nuevo estudio"
                                onAdd={() => handleAddStudyToUser(state.newStudy)}
                                onUpdate={(id) => handleUpdateStudy(id, state.editStudies[id])}
                                onDelete={(id) => handleDeleteRequest(id, 'study')}
                                editingId={state.editingStudyId}
                                setEditingId={(id) => setField('editingStudyId', id)}
                                editMap={state.editStudies}
                                setEditMap={(updater) => {
                                    const updated = typeof updater === 'function' ? updater(state.editStudies) : updater
                                    setField('editStudies', updated)
                                }}
                                inputValue={state.newStudy}
                                setInputValue={(val) => setField('newStudy', val)}
                                loadingRequest={state.loadingRequest}
                            />

                            <UserDetailSection
                                title="Direcciones"
                                items={state.selectedUser.addresses}
                                fieldName="location"
                                placeholder="Nueva dirección"
                                onAdd={() => handleAddAddressToUser(state.newAddress)}
                                onUpdate={(id) => handleUpdateAddress(id, state.editAddresses[id])}
                                onDelete={(id) => handleDeleteRequest(id, 'address')}
                                editingId={state.editingAddressId}
                                setEditingId={(id) => setField('editingAddressId', id)}
                                editMap={state.editAddresses}
                                setEditMap={(updater) => {
                                    const updated = typeof updater === 'function' ? updater(state.editAddresses) : updater
                                    setField('editAddresses', updated)
                                }}
                                inputValue={state.newAddress}
                                setInputValue={(val) => setField('newAddress', val)}
                                loadingRequest={state.loadingRequest}
                            />
                        </div>
                    )}
                </div>

                <ConfirmModal
                    isOpen={state.showConfirm}
                    message="Esta acción es irreversible"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setField('showConfirm', false)}
                />
            </div>
        </div>
    )

}

export default Admin