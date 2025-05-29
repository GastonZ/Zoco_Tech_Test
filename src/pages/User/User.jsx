import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import {
    getUserProfile,
    addStudy,
    updateStudy,
    addAddress,
    updateAddress,
    removeStudy,
    removeAddress,
    updateUserProfile
} from "../../api/mockApi"
import UserSection from "../../components/UserSection"
import styles from './style.module.css'
import RegularBtn from "../../components/buttons/RegularBtn"
import RegularInput from "../../components/inputs/RegularInput"
import { toastError, toastSuccess } from "../../utils/toasts"
import { isEmpty, isTooLong } from "../../utils/validations"

const User = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const [newStudy, setNewStudy] = useState("")
    const [newAddress, setNewAddress] = useState("")
    const [loadingRequest, setLoadingRequest] = useState(false)

    const [editStudies, setEditStudies] = useState({})
    const [editAddresses, setEditAddresses] = useState({})

    const [editingStudyId, setEditingStudyId] = useState(null)
    const [editingAddressId, setEditingAddressId] = useState(null)

    const [editingProfile, setEditingProfile] = useState(false)
    const [profileData, setProfileData] = useState({ name: '', photo: '' })

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

    const handleSaveProfile = async () => {
        if (isEmpty(profileData.name)) return toastError("El nombre no puede estar vacío")
        if (isTooLong(profileData.name, 50)) return toastError("El nombre es demasiado largo (máx. 50 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await updateUserProfile(profileData)
            setProfile(updated)
            setEditingProfile(false)
            toastSuccess('Perfil actualizado !')
            setLoadingRequest(false)
        } catch (err) {
            setLoadingRequest(false)
            toastError(`Error al actualizar: ${err}`)
        }
    }


    const handleAddStudy = async () => {
        if (isEmpty(newStudy)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(newStudy, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await addStudy({ title: newStudy })
            setProfile({ ...profile, studies: updated })
            setNewStudy("")
            toastSuccess('Estudio agregado !')

            setLoadingRequest(false)
        } catch (err) {
            toastError(`Error al agregar: ${err}`)
            setLoadingRequest(false)
        }
    }


    const handleAddAddress = async () => {
        if (isEmpty(newAddress)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(newAddress, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        try {
            setLoadingRequest(true)
            const updated = await addAddress({ location: newAddress })
            setProfile({ ...profile, addresses: updated })
            setNewAddress("")
            setLoadingRequest(false)
            toastSuccess('Dirección agregada !')
        } catch (err) {
            toastError(`Error al agregar: ${err}`)
            setLoadingRequest(false)
        }
    }

    const handleUpdateStudy = async (studyId) => {
        const value = editStudies[studyId]
        if (isEmpty(value)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(value, 100)) return toastError("El estudio es demasiado largo (máx. 100 caracteres)")

        setLoadingRequest(true)
        try {
            const updated = await updateStudy(studyId, { title: value })
            setProfile({ ...profile, studies: updated })
            setEditStudies((prev) => ({ ...prev, [studyId]: "" }))
            toastSuccess('Estudio actualizado !')
            setLoadingRequest(false)
        } catch (err) {
            toastError(`Error al actualizar: ${err}`)
            setLoadingRequest(false)
        }
    }



    const handleUpdateAddress = async (addressId) => {
        const value = editAddresses[addressId]
        if (isEmpty(value)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(value, 120)) return toastError("La dirección es demasiado larga (máx. 120 caracteres)")

        setLoadingRequest(true)
        try {
            const updated = await updateAddress(addressId, { location: value })
            setProfile({ ...profile, addresses: updated })
            setEditAddresses((prev) => ({ ...prev, [addressId]: "" }))
            toastSuccess('Dirección actualizada !')
            setLoadingRequest(false)
        } catch (err) {
            setLoadingRequest(false)
            toastError(`Error al actualizar: ${err}`)
        }
    }


    const handleDeleteStudy = async (studyId) => {
        try {
            setLoadingRequest(true)
            const updated = await removeStudy(studyId)
            setProfile({ ...profile, studies: updated })
            toastSuccess('Estudio eliminado !')
            setLoadingRequest(false)
        } catch (err) {
            console.error(err)
            setLoadingRequest(false)
            toastError(`Error al eliminar: ${err}`)
        }
    }

    const handleDeleteAddress = async (addressId) => {
        try {
            setLoadingRequest(true)
            const updated = await removeAddress(addressId)
            setProfile({ ...profile, addresses: updated })
            toastSuccess('Dirección eliminada !')
            setLoadingRequest(false)
        } catch (err) {
            console.error(err)
            setLoadingRequest(false)
            toastError(`Error al eliminar: ${err}`)
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
        <div className="p-4 flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center md:flex-row gap-4 md:gap-10 w-full max-w-6xl md:h-[800px]">
                <div className="bg-[#EEEDE4] flex flex-col gap-4 border p-6 rounded-2xl w-full h-full md:w-1/2">
                    <img
                        className="h-[350px] w-full object-cover rounded-xl"
                        src={editingProfile ? profileData.photo : profile.photo}
                        alt="User"
                    />

                    {editingProfile ? (
                        <>
                            <span className="text-sm font-semibold">Nombre</span>
                            <RegularInput
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <span className="text-sm font-semibold">Foto de perfil (URL)</span>
                            <RegularInput
                                value={profileData.photo}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, photo: e.target.value }))}
                                placeholder="URL de imagen de perfil"
                            />
                            <div className="mt-4 flex gap-2">
                                <RegularBtn
                                    text="Guardar cambios"
                                    disabled={loadingRequest}
                                    onClick={handleSaveProfile}
                                />
                                <RegularBtn
                                    text="Cancelar"
                                    onClick={() => setEditingProfile(false)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-[#333] underline">Nombre: {profile.name}</h2>
                            <p className="text-lg font-semibold text-[#333] underline">Email: {profile.email}</p>
                            <div className="mt-4">
                                <RegularBtn
                                    text="Editar"
                                    onClick={() => setEditingProfile(true)}
                                />
                            </div>
                        </>
                    )}

                </div>
                <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 h-full">
                    <div className="bg-white shadow-md rounded-2xl p-6 flex-1 flex">
                        <UserSection
                            title="Estudios"
                            items={profile.studies}
                            isEditing={!!editingStudyId}
                            editingId={editingStudyId}
                            editValues={editStudies}
                            onEditChange={(id, val) =>
                                setEditStudies((prev) => ({ ...prev, [id]: val }))
                            }
                            onEdit={(id) => {
                                handleUpdateStudy(id)
                                setEditingStudyId(null)
                            }}
                            onDelete={handleDeleteStudy}
                            onStartEdit={(id, label) => {
                                setEditingStudyId(id)
                                setEditStudies((prev) => ({ ...prev, [id]: label }))
                            }}
                            inputValue={newStudy}
                            onInputChange={setNewStudy}
                            onAdd={handleAddStudy}
                            addBtnDisabled={!newStudy.trim() || loadingRequest}
                            placeholder="Nuevo estudio"
                        />
                    </div>
                    <div className="bg-white shadow-md rounded-2xl p-6 flex-1 flex">
                        <UserSection
                            title="Direcciones"
                            items={profile.addresses}
                            isEditing={!!editingAddressId}
                            editingId={editingAddressId}
                            editValues={editAddresses}
                            onEditChange={(id, val) =>
                                setEditAddresses((prev) => ({ ...prev, [id]: val }))
                            }
                            onEdit={(id) => {
                                handleUpdateAddress(id)
                                setEditingAddressId(null)
                            }}
                            onDelete={handleDeleteAddress}
                            onStartEdit={(id, label) => {
                                setEditingAddressId(id)
                                setEditAddresses((prev) => ({ ...prev, [id]: label }))
                            }}
                            inputValue={newAddress}
                            onInputChange={setNewAddress}
                            onAdd={handleAddAddress}
                            addBtnDisabled={!newAddress.trim() || loadingRequest}
                            placeholder="Nueva dirección"
                            itemLabel="location"
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default User
