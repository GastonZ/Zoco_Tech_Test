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
import UserSection from "../components/UserSection"

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
                addBtnDisabled={!newStudy.trim()}
                placeholder="Nuevo estudio"
            />

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
                addBtnDisabled={!newAddress.trim()}
                placeholder="Nueva dirección"
                itemLabel="location"
            />
        </div>
    )
}

export default User
