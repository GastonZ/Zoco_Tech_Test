import axios from 'axios'
import { simulateDelay } from '../utils/helper'

let users = []
const STORAGE_KEY = 'users'

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

export const initUsers = async () => {
    await loadInitialUsers()
}

let nextUserId = users.length + 1

const getNextUserId = () => {
    if (users.length === 0) return 1
    const maxId = Math.max(...users.map(u => u.id || 0))
    return maxId + 1
}

const saveUsersData = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

const getUserFromToken = () => {
    const token = sessionStorage.getItem('token')
    if (!token) throw new Error('No autorizado')
    return JSON.parse(atob(token))
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
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)

    const emailExists = users.some(x => x.email === userData.email)
    if (emailExists) throw new Error('El email ya existe')

    const newUser = {
        id: getNextUserId(),
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
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    return users.map(({ password, ...x }) => x)
}

export const getUserProfile = async () => {
    const current = getUserFromToken()
    await simulateDelay(400)
    const user = users.find(x => x.email === current.email)
    if (!user) throw new Error('Usuario no encontrado')
    const { password, ...rest } = user
    return rest
}

// User functions ...

export const addStudy = async (study) => {
    const current = getUserFromToken()
    await simulateDelay(500)
    const user = users.find(x => x.email === current.email)
    user.studies.push({ id: Date.now(), ...study })
    saveUsersData()
    return user.studies
}

export const updateStudy = async (studyId, updatedStudies) => {
    const current = getUserFromToken()
    await simulateDelay(600)
    const user = users.find(x => x.email === current.email)
    user.studies = user.studies.map(x => x.id === studyId ? { ...x, ...updatedStudies } : x)
    saveUsersData()
    return user.studies
}

export const removeStudy = async (studyId) => {
    const current = getUserFromToken()
    await simulateDelay(400)
    const user = users.find(x => x.email === current.email)
    const index = user.studies.findIndex(x => x.id === studyId)
    user.studies.splice(index, 1)
    saveUsersData()
    return user.studies
}

export const addAddress = async (address) => {
    const current = getUserFromToken()
    await simulateDelay(500)
    const user = users.find(x => x.email === current.email)
    user.addresses.push({ id: Date.now(), ...address })
    saveUsersData()
    return user.addresses
}

export const updateAddress = async (addressId, updatedAddress) => {
    const current = getUserFromToken()
    await simulateDelay(500)
    const user = users.find(x => x.email === current.email)
    user.addresses = user.addresses.map(x => x.id === addressId ? { ...x, ...updatedAddress } : x)
    saveUsersData()
    return user.addresses
}

export const removeAddress = async (addressId) => {
    const current = getUserFromToken()
    await simulateDelay(400)
    const user = users.find(x => x.email === current.email)
    const index = user.addresses.findIndex(x => x.id === addressId)
    user.addresses.splice(index, 1)
    saveUsersData()
    return user.addresses
}

export const updateUserProfile = async (updatedFields) => {
    const current = getUserFromToken()
    await simulateDelay(500)
    const user = users.find(x => x.email === current.email)
    if (!user) throw new Error('Usuario no encontrado')
    Object.assign(user, updatedFields)
    saveUsersData()
    const { password, ...safeUser } = user
    return safeUser
}

// Admin functions ...

export const adminAddStudy = async (userId, study) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.studies.push({ id: Date.now(), ...study })
    saveUsersData()
    return user.studies
}

export const adminUpdateStudy = async (userId, studyId, updated) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.studies = user.studies.map(s => s.id === studyId ? { ...s, ...updated } : s)
    saveUsersData()
    return user.studies
}

export const adminRemoveStudy = async (userId, studyId) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.studies = user.studies.filter(s => s.id !== studyId)
    saveUsersData()
    return user.studies
}

export const adminAddAddress = async (userId, address) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.addresses.push({ id: Date.now(), ...address })
    saveUsersData()
    return user.addresses
}

export const adminUpdateAddress = async (userId, addressId, updated) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.addresses = user.addresses.map(a => a.id === addressId ? { ...a, ...updated } : a)
    saveUsersData()
    return user.addresses
}

export const adminRemoveAddress = async (userId, addressId) => {
    const current = getUserFromToken()
    if (current.role !== 'admin') throw new Error('No autorizado')
    await simulateDelay(400)
    const user = users.find(x => x.id === userId)
    user.addresses = user.addresses.filter(a => a.id !== addressId)
    saveUsersData()
    return user.addresses
}
