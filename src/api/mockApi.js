import axios from 'axios'
import { simulateDelay } from '../utils/helper'

let users = []
const STORAGE_KEY = 'users'

const checkToken = () => {
    const token = sessionStorage.getItem('token')
    if (!token) throw new Error('No autorizado')
}

const loadInitialUsers = async () => {
    const savedUsers = sessionStorage.getItem(STORAGE_KEY)
    if (savedUsers) {
        users = JSON.parse(savedUsers)
    } else {
        const { data } = await axios.get('/mock/users.json')
        users = data.users
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    }
}

await loadInitialUsers()

let nextUserId = users.length + 1

const saveUsersData = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const login = async ({ email, password }) => {
    await simulateDelay(800)
    const user = users.find(x => x.email === email && x.password === password)
    if (!user) throw new Error('Credenciales incorrectas')

    const token = btoa(JSON.stringify({ email: user.email, role: user.role }))
    return {
        token,
        user: { id: user.id, name: user.name, role: user.role, email: user.email }
    }
}

export const createUser = async (userData) => {
    checkToken()
    await simulateDelay(400)
    const newUser = {
        id: nextUserId++,
        ...userData,
        photo: userData.photo || 'https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png',
        studies: [],
        addresses: []
    }
    users.push(newUser)
    saveUsersData()
    return newUser
}

export const getAllUsers = async () => {
    checkToken()
    await simulateDelay(400)
    return users.map(({ password, ...u }) => u)
}

export const getUserProfile = async (email) => {
    checkToken()
    await simulateDelay(400)
    const user = users.find(x => x.email === email)
    if (!user) throw new Error('Usuario no encontrado')
    const { password, ...rest } = user
    return rest
}

export const addStudy = async (userId, study) => {
    checkToken()
    await simulateDelay(500)
    const user = users.find(x => x.id === userId)
    user.studies.push({ id: Date.now(), ...study })
    saveUsersData()
    return user.studies
}

export const updateStudy = async (userId, studyId, updatedStudies) => {
    checkToken()
    await simulateDelay(600)
    const user = users.find(x => x.id === userId)
    user.studies = user.studies.map(x => x.id === studyId ? { ...x, ...updatedStudies } : x)
    saveUsersData()
    return user.studies
}

export const removeStudy = async (userId, studyId) => {
    checkToken()
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    const studyIndex = user.studies.findIndex(x => x.id === studyId)
    user.studies.splice(studyIndex, 1)
    saveUsersData()
    return user.studies
}

export const addAddress = async (userId, address) => {
    checkToken()
    await simulateDelay(500)
    const user = users.find(x => x.id === userId)
    user.addresses.push({ id: Date.now(), ...address })
    saveUsersData()
    return user.addresses
}

export const updateAddress = async (userId, addressId, updatedAddress) => {
    checkToken()
    await simulateDelay(500)
    const user = users.find(x => x.id === userId)
    user.addresses = user.addresses.map(x => x.id === addressId ? { ...x, ...updatedAddress } : x)
    saveUsersData()
    return user.addresses
}

export const removeAddress = async (userId, addressId) => {
    checkToken()
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    const addressIndex = user.addresses.findIndex(x => x.id === addressId)
    user.addresses.splice(addressIndex, 1)
    saveUsersData()
    return user.addresses
}

export const updateUserProfile = async (userId, updatedFields) => {
    checkToken()
    await simulateDelay(500)
    const user = users.find(u => u.id === userId)
    if (!user) throw new Error("Usuario no encontrado")
    Object.assign(user, updatedFields)
    saveUsersData()
    const { password, ...safeUser } = user
    return safeUser
}
