import React from 'react'
import RegularInput from './inputs/RegularInput';
import RegularBtn from './buttons/RegularBtn';

const CreateUserForm = ({ initialUser, onChange, onSubmit }) => {

    const inputUserClassName = "border px-2 py-1 rounded w-full"

    return (
        <div className="p-4 border rounded shadow-md space-y-2">
            <h3 className="font-semibold">Crear nuevo usuario</h3>
            <RegularInput
                placeholder={"Nombre"}
                className={inputUserClassName}
                value={initialUser.name}
                onChange={(e) => onChange({ ...initialUser, name: e.target.value })}
            />
            <RegularInput
                type="email"
                placeholder={"Email"}
                className={inputUserClassName}
                value={initialUser.email}
                onChange={(e) => onChange({ ...initialUser, email: e.target.value })}
            />
            <RegularInput
                type="text"
                placeholder={"Foto de perfil (URL) *Opcional"}
                className={inputUserClassName}
                value={initialUser.photo}
                onChange={(e) => onChange({ ...initialUser, photo: e.target.value })}
            />
            <RegularInput
                type="password"
                placeholder="Contraseña"
                className={inputUserClassName}
                value={initialUser.password}
                onChange={(e) => onChange({ ...initialUser, password: e.target.value })}
            />
            <select
                className={"border px-2 py-1 rounded w-full"}
                value={initialUser.role}
                onChange={(e) => onChange({ ...initialUser, role: e.target.value })}
            >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
            </select>
            <RegularBtn
                onClick={onSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                text={"Crear usuario"}
            />
        </div>
    )
}

export default CreateUserForm;
