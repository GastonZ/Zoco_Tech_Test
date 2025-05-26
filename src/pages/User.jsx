import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, addStudy, updateStudy, addAddress, updateAddress } from "../api/mockApi";

const User = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [newStudy, setNewStudy] = useState('')
  const [newAddress, setNewAddress] = useState('')

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
    setNewStudy('')
  }

  const handleAddAddress = async () => {
    const updated = await addAddress(profile.id, { location: newAddress })
    setProfile({ ...profile, addresses: updated })
    setNewAddress('')
  }

  if (loading) return <p className="p-4">Cargando perfil...</p>

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Perfil de {profile.name}</h2>
      <p>Email: {profile.email}</p>
      
      <section>
        <h3 className="font-semibold">Estudios</h3>
        <ul className="list-disc ml-5">
          {profile.studies.map(s => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Nuevo estudio"
            value={newStudy}
            onChange={e => setNewStudy(e.target.value)}
          />
          <button onClick={handleAddStudy} className="bg-blue-500 text-white px-3 py-1 rounded">
            Agregar
          </button>
        </div>
      </section>

      <section>
        <h3 className="font-semibold">Direcciones</h3>
        <ul className="list-disc ml-5">
          {profile.addresses.map(a => (
            <li key={a.id}>{a.location}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Nueva dirección"
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
          />
          <button onClick={handleAddAddress} className="bg-blue-500 text-white px-3 py-1 rounded">
            Agregar
          </button>
        </div>
      </section>
    </div>
  )
}

export default User