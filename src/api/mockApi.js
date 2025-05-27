let users = []

const savedUsers = sessionStorage.getItem('users')
if (savedUsers) {
    users = JSON.parse(savedUsers)
} else {
    users = [
        {
            id: 1,
            name: 'Levi Ackerman',
            email: 'admin@gmail.com',
            password: 'admin',
            role: 'admin',
            studies: [],
            addresses: [],
        },
        {
            id: 2,
            name: 'Annie Leonhart',
            email: 'user@gmail.com',
            password: 'user',
            role: 'user',
            studies: [],
            addresses: [],
        }
    ]
    sessionStorage.setItem('users', JSON.stringify(users))
}

let nextUserId = users.length + 1

const saveUsersData = () => {
    sessionStorage.setItem('users', JSON.stringify(users))
}


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

export const createUser = (userData) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const newUser = {
                id: nextUserId++,
                ...userData,
                studies: [],
                addresses: []
            }
            users.push(newUser)
            saveUsersData()
            res(newUser)
        }, 400)
    })
}

export const getAllUsers = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(users.map(({ password, ...u }) => u))
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
            saveUsersData()
            res(user.studies)
        }, 500)
    })
}

export const updateStudy = (userId, studyId, updatedStudies) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.studies = user.studies.map(x => x.id === studyId ? { ...x, ...updatedStudies } : x)
            saveUsersData()
            res(user.studies)
        }, 600)
    })
}

export const removeStudy = (userId, studyId) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            const studyIndex = user.studies.findIndex(x => x.id === studyId)
            user.studies.splice(studyIndex, 1)
            saveUsersData()
            res(user.studies)
        }, 400)
    })
}


export const addAddress = (userId, address) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.addresses.push({ id: Date.now(), ...address })
            saveUsersData()
            res(user.addresses)
        }, 500)
    })
}

export const updateAddress = (userId, addressId, updatedAddress) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            user.addresses = user.addresses.map(x => x.id === addressId ? { ...x, ...updatedAddress } : x)
            saveUsersData()
            res(user.addresses)
        }, 500)
    })
}

export const removeAddress = (userId, addressId) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const user = users.find(x => x.id === userId)
            const addressIndex = user.addresses.findIndex(x => x.id === addressId)
            user.addresses.splice(addressIndex, 1)
            saveUsersData()
            res(user.addresses)
        }, 400)
    })
}
