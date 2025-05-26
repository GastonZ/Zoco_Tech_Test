let users = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin',
        role: 'admin',
        studies: [],
        addresses: []
    },
    {
        id: 1,
        name: 'User',
        email: 'user@gmail.com',
        password: 'user',
        role: 'user',
        studies: [],
        addresses: []
    },
]

let nextUserId = 3

export const login = ({ email, password }) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.email === email && x.password === password)
            if (!user) return rej('Credenciales incorrectas')

            const token = btoa(JSON.stringify({ email: user.email, role: user.role }))
            res({
                token,
                user: { id: user.id, name: user.name, role: user.role, email: user.email }
            })
        }, 800)
    })
}

export const getAllUsers = (userData) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const newUser = {
                id: nextUserId++,
                ...userData,
                studies: [],
                addresses: []
            }
            users.push(newUser)
            res(newUser)
        }, 400)
    })
}

export const getUserProfile = (email) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.email === email)
            if (!user) {
                rej('Usuario no encontrado')
            }
            const { password, ...rest } = user
            res(rest)
        }, 400)
    })
}

export const addStudy = (userId, study) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.studies.push({ id: Date.now(), ...study })
            res(user.studies)
        }, 500)
    })
}

export const updateStudy = (userId, studyId, updatedStudies) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.studies = user.studies.map(x => x.id === studyId ? { ...x, ...updatedStudies } : x)
            res(user.studies)
        }, 600)
    })
}

export const removeStudy = (userId, studyId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            const studyIndex = user.studies.findIndex(x => x.id === studyId)
            user.studies.splice(studyIndex, 1)
            resolve(user.studies)
        }, 400)
    })
}


export const addAddress = (userId, address) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.addresses.push({ id: Date.now(), ...address })
            res(user.addresses)
        }, 500)
    })
}

export const updateAddress = (userId, addressId, updatedAddress) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.addresses = user.addresses.map(x => x.id === addressId ? { ...x, ...updatedAddress } : x)
            res(user.addresses)
        }, 500)
    })
}

export const removeAddress = (userId, addressId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            const addressIndex = user.addresses.findIndex(x => x.id === addressId)
            user.addresses.splice(addressIndex, 1)
            resolve(user.addresses)
        }, 400)
    })
}
