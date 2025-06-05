# Zoco Tech Test – Frontend App

Este proyecto es una aplicación de prueba técnica para Zoco Tech, construida con **React**, **Vite**, y **React Router**, que simula un sistema de autenticación con usuarios predefinidos, un panel de administración y edición de perfiles.

**[Ver demo desplegada](https://zoco-tech-test.vercel.app/)**

---

## Características

- Login con validación de usuarios simulados
- Panel de administración para crear usuarios, agregar estudios y direcciones
- Panel de usuario para editar perfil, agregar/editar estudios y direcciones
- Almacenamiento temporal de usuarios con `sessionStorage`
- Notificaciones con `react-toastify`
- Validaciones y confirmaciones visuales
- Mobile-first y diseño responsivo

---

## Usuarios disponibles

Al iniciar la app, hay dos usuarios preconfigurados:

### Usuario normal
- **Email**: `user@gmail.com`
- **Contraseña**: `user`

### Usuario administrador
- **Email**: `admin@gmail.com`
- **Contraseña**: `admin`

---

## Cómo correr el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/GastonZ/Zoco_Tech_Test.git
cd zoco-tech-test
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Correr el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:5173]

---

## Estructura del proyecto

```
src/
├── api/            # Lógica simulada de autenticación y gestión de usuarios
├── assets/         # Archivos estáticos (íconos, imágenes)
├── components/     # Componentes reutilizables (modales, inputs, botones)
├── context/        # Contexto de autenticación
├── layout/         # Layout global (envoltorio con Toast y estilos base)
├── pages/          # Vistas: Login, Admin y User
├── routes/         # Rutas protegidas
├── utils/          # Validaciones, notificaciones y helpers
├── App.jsx         # Ruteo principal de la aplicación
├── main.jsx        # Punto de entrada de React + inicialización
```

---

## Metodología de trabajo

El desarrollo fue planificado y gestionado mediante **GitHub Projects**, dividiendo el trabajo por tareas en una board tipo kanban. Esto permitió mantener el orden y prioridades del progreso.

🔗 [Ver tablero del proyecto en GitHub](https://github.com/users/GastonZ/projects/4)

---

## Autor

**Gaston Zappulla**

[Portfolio personal](https://frontend-dev-portfolio-xi.vercel.app/)

Contacto disponible desde el portfolio
