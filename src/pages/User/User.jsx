import { useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import {
    getUserProfile,
    addStudy,
    updateStudy,
    addAddress,
    updateAddress,
    removeStudy,
    removeAddress,
    updateUserProfile,
} from "../../api/mockApi"
import UserSection from "../../components/UserSection"
import RegularBtn from "../../components/buttons/RegularBtn"
import RegularInput from "../../components/inputs/RegularInput"
import { toastError, toastSuccess } from "../../utils/toasts"
import { isEmpty, isTooLong } from "../../utils/validations"
import LogoutBtn from "../../components/buttons/LogoutBtn"
import UseFormState from "../../hooks/UseFormState"

const User = () => {
    const { user } = useAuth()

    const {
        state,
        updateField,
        setField,
        resetField,
        setLoadingRequest,
    } = UseFormState({
        profileData: { name: "", photo: "" },
        nameError: "",
        newStudy: "",
        newAddress: "",
        editStudies: {},
        editAddresses: {},
        editingStudyId: null,
        editingAddressId: null,
        loadingRequest: false,
        profile: null,
        editingProfile: false,
        loading: true,
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(user.email)
                setField("profileData", { name: data.name, photo: data.photo })
                setField("profile", data)
            } catch (err) {
                console.error(err)
            } finally {
                setField("loading", false)
            }
        }

        fetchProfile()
    }, [user.email])

    const handleSaveProfile = async () => {
        if (isEmpty(state.profileData.name)) {
            setField("nameError", "El nombre no puede estar vacío")
            return toastError("El nombre no puede estar vacío")
        }

        if (isTooLong(state.profileData.name, 50)) {
            setField("nameError", "El nombre es demasiado largo")
            return toastError("El nombre es demasiado largo")
        }

        setField("nameError", "")

        try {
            setLoadingRequest(true)
            const updated = await updateUserProfile(state.profileData)
            setField("profile", updated)
            setField("editingProfile", false)
            toastSuccess("Perfil actualizado!")
        } catch (err) {
            toastError("Error al actualizar perfil")
        } finally {
            setLoadingRequest(false)
        }
    }


    const handleAddStudy = async () => {
        if (isEmpty(state.newStudy)) return toastError("El estudio no puede estar vacío")
        if (isTooLong(state.newStudy, 100)) return toastError("Máx. 100 caracteres")

        try {
            setLoadingRequest(true)
            const updated = await addStudy({ title: state.newStudy })
            setField("profile", { ...state.profile, studies: updated })
            resetField("newStudy")
            toastSuccess("Estudio agregado!")
        } catch (err) {
            toastError("Error al agregar estudio")
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleAddAddress = async () => {
        if (isEmpty(state.newAddress)) return toastError("La dirección no puede estar vacía")
        if (isTooLong(state.newAddress, 120)) return toastError("Máx. 120 caracteres")

        try {
            setLoadingRequest(true)
            const updated = await addAddress({ location: state.newAddress })
            setField("profile", { ...state.profile, addresses: updated })
            resetField("newAddress")
            toastSuccess("Dirección agregada!")
        } catch (err) {
            toastError("Error al agregar dirección")
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleUpdateItem = async (id, value, label, updater, editKey) => {
        if (isEmpty(value)) return toastError(`${label} no puede estar vacío`)
        if (isTooLong(value, 120)) return toastError(`${label} muy largo`)

        try {
            setLoadingRequest(true)
            const updated = await updater(id, label === "Estudio" ? { title: value } : { location: value })
            setField("profile", {
                ...state.profile,
                [label === "Estudio" ? "studies" : "addresses"]: updated,
            })
            updateField(editKey, { ...state[editKey], [id]: "" })
        } catch (err) {
            toastError(`Error al actualizar ${label.toLowerCase()}`)
        } finally {
            setLoadingRequest(false)
        }
    }

    const handleDeleteItem = async (id, remover, key) => {
        try {
            setLoadingRequest(true)
            const updated = await remover(id)
            setField("profile", { ...state.profile, [key]: updated })
            toastSuccess(`${key === "studies" ? "Estudio" : "Dirección"} eliminada!`)
        } catch (err) {
            toastError("Error al eliminar")
        } finally {
            setLoadingRequest(false)
        }
    }

    if (state.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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

            <div className="p-4 flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center md:flex-row gap-4 md:gap-10 w-full max-w-6xl md:h-[800px]">
                    <div className="bg-[#EEEDE4] flex flex-col gap-4 border p-6 rounded-2xl w-full h-full md:w-1/2">
                        <img
                            className="h-[350px] w-full object-cover rounded-xl"
                            src={state.editingProfile ? state.profileData.photo : state.profile.photo}
                            alt="User"
                        />

                        {state.editingProfile ? (
                            <>
                                <span className="text-sm font-semibold">Nombre</span>
                                <RegularInput
                                    value={state.profileData.name}
                                    onChange={(e) => {
                                        updateField("profileData", { ...state.profileData, name: e.target.value })
                                        if (e.target.value.trim()) setField("nameError", "")
                                    }}
                                />
                                {state.nameError && (
                                    <span className="text-xs text-red-500 -mt-2">{state.nameError}</span>
                                )}

                                <span className="text-sm font-semibold">Foto de perfil (URL)</span>
                                <RegularInput
                                    value={state.profileData.photo}
                                    onChange={(e) =>
                                        updateField("profileData", { ...state.profileData, photo: e.target.value })
                                    }
                                />
                                <div className="mt-4 flex gap-2">
                                    <RegularBtn
                                        text="Guardar cambios"
                                        disabled={state.loadingRequest}
                                        onClick={handleSaveProfile}
                                    />
                                    <RegularBtn text="Cancelar" onClick={() => setField("editingProfile", false)} />
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold text-[#333] underline">
                                    Nombre: {state.profile.name}
                                </h2>
                                <p className="text-lg font-semibold text-[#333] underline">
                                    Email: {state.profile.email}
                                </p>
                                <div className="mt-4">
                                    <RegularBtn text="Editar" onClick={() => setField("editingProfile", true)} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 h-full">
                        <div className="bg-white shadow-md rounded-2xl p-6 flex-1 flex">
                            <UserSection
                                title="Estudios"
                                items={state.profile.studies}
                                isEditing={!!state.editingStudyId}
                                editingId={state.editingStudyId}
                                editValues={state.editStudies}
                                onEditChange={(id, val) =>
                                    updateField("editStudies", { ...state.editStudies, [id]: val })
                                }
                                onEdit={(id) => {
                                    handleUpdateItem(id, state.editStudies[id], "Estudio", updateStudy, "editStudies")
                                    setField("editingStudyId", null)
                                }}
                                onDelete={(id) => handleDeleteItem(id, removeStudy, "studies")}
                                onStartEdit={(id, label) => {
                                    setField("editingStudyId", id)
                                    updateField("editStudies", { ...state.editStudies, [id]: label })
                                }}
                                inputValue={state.newStudy}
                                onInputChange={(val) => setField("newStudy", val)}
                                onAdd={handleAddStudy}
                                addBtnDisabled={!state.newStudy.trim() || state.loadingRequest}
                                placeholder="Nuevo estudio"
                            />
                        </div>

                        <div className="bg-white shadow-md rounded-2xl p-6 flex-1 flex">
                            <UserSection
                                title="Direcciones"
                                items={state.profile.addresses}
                                isEditing={!!state.editingAddressId}
                                editingId={state.editingAddressId}
                                editValues={state.editAddresses}
                                onEditChange={(id, val) =>
                                    updateField("editAddresses", { ...state.editAddresses, [id]: val })
                                }
                                onEdit={(id) => {
                                    handleUpdateItem(id, state.editAddresses[id], "Dirección", updateAddress, "editAddresses")
                                    setField("editingAddressId", null)
                                }}
                                onDelete={(id) => handleDeleteItem(id, removeAddress, "addresses")}
                                onStartEdit={(id, label) => {
                                    setField("editingAddressId", id)
                                    updateField("editAddresses", { ...state.editAddresses, [id]: label })
                                }}
                                inputValue={state.newAddress}
                                onInputChange={(val) => setField("newAddress", val)}
                                onAdd={handleAddAddress}
                                addBtnDisabled={!state.newAddress.trim() || state.loadingRequest}
                                placeholder="Nueva dirección"
                                itemLabel="location"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
