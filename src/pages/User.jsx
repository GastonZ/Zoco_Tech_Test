import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
    getUserProfile,
    addStudy,
    updateStudy,
    addAddress,
    updateAddress,
    removeStudy,
    removeAddress
} from "../api/mockApi"

const User = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const [newStudy, setNewStudy] = useState("")
    const [newAddress, setNewAddress] = useState("")

    const [editStudies, setEditStudies] = useState({})
    const [editAddresses, setEditAddresses] = useState({})

    const [editingStudyId, setEditingStudyId] = useState(null)
    const [editingAddressId, setEditingAddressId] = useState(null)
    console.log(user);

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(user.email)
                setProfile(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }


        fetchProfile()
    }, [user.email])

    const handleAddStudy = async () => {
        const updated = await addStudy(profile.id, { title: newStudy })
        setProfile({ ...profile, studies: updated })
        setNewStudy("")
    }

    const handleAddAddress = async () => {
        const updated = await addAddress(profile.id, { location: newAddress })
        setProfile({ ...profile, addresses: updated })
        setNewAddress("")
    }

    const handleUpdateStudy = async (studyId) => {
        const updated = await updateStudy(profile.id, studyId, {
            title: editStudies[studyId],
        })
        setProfile({ ...profile, studies: updated })
        setEditStudies((prev) => ({ ...prev, [studyId]: "" }))
    }

    const handleUpdateAddress = async (addressId) => {
        const updated = await updateAddress(profile.id, addressId, {
            location: editAddresses[addressId],
        })
        setProfile({ ...profile, addresses: updated })
        setEditAddresses((prev) => ({ ...prev, [addressId]: "" }))
    }

    const handleDeleteStudy = async (studyId) => {
        try {
            const updated = await removeStudy(profile.id, studyId)
            setProfile({ ...profile, studies: updated })
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteAddress = async (studyId) => {
        try {
            const updated = await removeAddress(profile.id, studyId)
            setProfile({ ...profile, addresses: updated })
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <p className="p-4">Cargando perfil...</p>

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">Perfil de {profile.name}</h2>
            <p>Email: {profile.email}</p>

            <section>
                <h3 className="font-semibold">Estudios</h3>
                <ul className="space-y-2">
                    {profile.studies.map((studie) => {
                        const isEditing = editingStudyId === studie.id
                        const currentValue = editStudies[studie.id] ?? studie.title
                        const isChanged = currentValue !== studie.title
                        const isValid = currentValue.trim() !== ""

                        return (
                            <li key={studie.id} className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={currentValue}
                                            onChange={(e) =>
                                                setEditStudies((prev) => ({
                                                    ...prev,
                                                    [studie.id]: e.target.value,
                                                }))
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                        <button
                                            onClick={() => {
                                                handleUpdateStudy(studie.id)
                                                setEditingStudyId(null)
                                            }}
                                            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                            disabled={!isChanged || !isValid}
                                        >
                                            Guardar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-full">{studie.title}</span>
                                        <button
                                            onClick={() => {
                                                setEditingStudyId(studie.id)
                                                setEditStudies((prev) => ({ ...prev, [studie.id]: studie.title }))
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('¿Estás seguro de eliminar este estudio?')) {
                                                    handleDeleteStudy(studie.id)
                                                }
                                            }}
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

                <div className="flex gap-2 mt-2">
                    <input
                        className="border px-2 py-1 rounded w-full"
                        placeholder="Nuevo estudio"
                        value={newStudy}
                        onChange={(e) => setNewStudy(e.target.value)}
                    />
                    <button
                        onClick={handleAddStudy}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        disabled={!newStudy.trim()}
                    >
                        Agregar
                    </button>
                </div>
            </section>

            <section>
                <h3 className="font-semibold">Direcciones</h3>
                <ul className="space-y-2">
                    {profile.addresses.map((address) => {
                        const isEditing = editingAddressId === address.id
                        const currentValue = editAddresses[address.id] ?? address.location
                        const isChanged = currentValue !== address.location
                        const isValid = currentValue.trim() !== ""

                        return (
                            <li key={address.id} className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={currentValue}
                                            onChange={(e) =>
                                                setEditAddresses((prev) => ({
                                                    ...prev,
                                                    [address.id]: e.target.value,
                                                }))
                                            }
                                            className="border px-2 py-1 rounded w-full"
                                        />
                                        <button
                                            onClick={() => {
                                                handleUpdateAddress(address.id)
                                                setEditingAddressId(null)
                                            }}
                                            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                                            disabled={!isChanged || !isValid}
                                        >
                                            Guardar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-full">{address.location}</span>
                                        <button
                                            onClick={() => {
                                                setEditingAddressId(address.id)
                                                setEditAddresses((prev) => ({
                                                    ...prev,
                                                    [address.id]: address.location,
                                                }))
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('¿Estás seguro de eliminar esta dirección?')) {
                                                    handleDeleteAddress(address.id)
                                                }
                                            }}
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

                <div className="flex gap-2 mt-2">
                    <input
                        className="border px-2 py-1 rounded w-full"
                        placeholder="Nueva dirección"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                    <button
                        onClick={handleAddAddress}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        disabled={!newAddress.trim()}
                    >
                        Agregar
                    </button>
                </div>
            </section>
        </div>
    )
}

export default User
