import React from 'react'
import RegularInput from './inputs/RegularInput';
import RegularBtn from './buttons/RegularBtn';

const CreateUserForm = ({ initialUser, onChange, onSubmit, sendingRequest }) => {


    return (
        <div className="p-4 border shadow-md space-y-2 rounded-xl bg-[#EEEDE4]">
            <h3 className="font-semibold">Crear nuevo usuario</h3>
            <RegularInput
                placeholder={"Nombre"}
                value={initialUser.name}
                onChange={(e) => onChange({ ...initialUser, name: e.target.value })}
            />
            <RegularInput
                type="email"
                placeholder={"Email"}
                value={initialUser.email}
                onChange={(e) => onChange({ ...initialUser, email: e.target.value })}
            />
            <RegularInput
                type="text"
                placeholder={"Foto de perfil (URL) *Opcional"}
                value={initialUser.photo}
                onChange={(e) => onChange({ ...initialUser, photo: e.target.value })}
            />
            <RegularInput
                type="password"
                placeholder="Contraseña"
                value={initialUser.password}
                onChange={(e) => onChange({ ...initialUser, password: e.target.value })}
            />
            <select
                className={"border px-2 py-1 rounded w-full bg-white"}
                value={initialUser.role}
                onChange={(e) => onChange({ ...initialUser, role: e.target.value })}
            >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
            </select>
            <RegularBtn
                onClick={onSubmit}
                disabled={sendingRequest}
                className="bg-yellow-300 text-black font-semibold hover:bg-yellow-500 cursor-pointer transition px-4 py-2 rounded mt-2"
                text={"Crear usuario"}
            />
        </div>
    )
}

export default CreateUserForm;
