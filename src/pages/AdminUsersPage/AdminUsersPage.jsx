import { useCallback, useEffect, useState } from "react" //Importa hooks de React para manejar funciones memorizadas, ciclo de vida y múltiples estados locales
import { PencilLine, Trash2 } from "lucide-react" //Importa los iconos de edición y eliminación desde lucide-react
import { deleteUser, getUsers, updateUser } from "../../api/users.js" //Importa las funciones API para obtener, actualizar y eliminar usuarios
import styles from "./AdminUsersPage.module.css" //Importa los estilos CSS parametrizados como módulos

const emptyEditForm = { name: "", email: "", role: "USER" } //Estructura limpia por defecto para el formulario de edición rápida

function AdminUsersPage() { //Componente principal para el panel de gestión de usuarios
  const [users, setUsers] = useState([]) //Estado para guardar la lista de usuarios cargados
  const [loading, setLoading] = useState(true) //Estado para controlar el indicador de carga inicial
  const [error, setError] = useState("") //Estado para capturar y mostrar errores de peticiones
  const [deletingId, setDeletingId] = useState(null) //Estado para rastrear qué usuario se está eliminando
  const [editingId, setEditingId] = useState(null) //Estado para rastrear qué fila de usuario está activada en modo edición (ID del usuario)
  const [editForm, setEditForm] = useState(emptyEditForm) //Estado para los campos del formulario de edición rápida en línea
  const [savingId, setSavingId] = useState(null) //Estado para saber qué usuario se está guardando activamente

  const fetchUsers = useCallback(async () => { //Función para solicitar la lista de usuarios al backend
    try {
      setLoading(true)
      setError("")
      const response = await getUsers()
      setUsers(Array.isArray(response) ? response : []) //Asegura que siempre se establezca un arreglo, incluso si la API responde otra cosa
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudieron cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { //Carga los usuarios al montar el componente
    fetchUsers()
  }, [fetchUsers])

  function startEditing(user) { //Inicia la edición en línea de un usuario específico rellenando los campos con su información actual
    setEditingId(user.id)
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: String(user.role || "USER").toUpperCase(),
    })
    setError("")
  }

  function cancelEditing() { //Cancela la edición y reinicia los estados del formulario en línea
    setEditingId(null)
    setEditForm(emptyEditForm)
    setError("")
  }

  function handleEditChange(event) { //Actualiza el estado del formulario de edición cuando el usuario escribe o cambia una opción
    const { name, value } = event.target
    setEditForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSave(user) { //Guarda los cambios del usuario editado en línea
    const name = editForm.name.trim()
    const email = editForm.email.trim()
    const role = editForm.role.toUpperCase()

    if (!name || !email) { //Validaciones locales antes de enviar la petición
      setError("Nombre y email son obligatorios.")
      return
    }

    if (!/^(USER|ADMIN)$/i.test(role)) {
      setError("El rol debe ser USER o ADMIN.")
      return
    }

    try {
      setSavingId(user.id)
      setError("")

      const payload = { name, email, role }
      const response = await updateUser(user.id, payload)
      const updatedUser = response?.user ?? response?.data?.user ?? response?.data ?? response ?? {} //Normaliza la respuesta de la API dependiendo de la estructura retornada por el backend

      setUsers((current) => //Actualiza el usuario específico dentro del estado local sin recargar la lista completa
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                ...updatedUser,
                name: updatedUser.name ?? item.name ?? name,
                email: updatedUser.email ?? item.email ?? email,
                role: updatedUser.role ?? item.role ?? role,
              }
            : item,
        ),
      )
      cancelEditing()
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo actualizar el usuario.")
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(user) { //Maneja la eliminación de un usuario con confirmación previa
    if (!window.confirm(`¿Eliminar al usuario “${user.name || user.email || "usuario"}”?`)) return

    try {
      setDeletingId(user.id)
      setError("")
      await deleteUser(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id)) //Remueve el usuario del estado local
      if (editingId === user.id) cancelEditing() //Si el usuario borrado estaba siendo editado, cierra el modo edición
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo eliminar el usuario.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>STORELAB / USUARIOS</p>
          <h1>Usuarios</h1>
          <p className={styles.description}>Consulta y gestiona las cuentas y roles de StoreLab.</p>
        </div>
      </header>

      {/*Mensaje de error visible en caso de fallo*/}
      {error && <p className={styles.error} role="alert">{error}</p>}

      {/*Control del estado de la interfaz: Carga -> Estado Vacío -> Tabla de Datos*/}
      {loading ? (
        <p className={styles.status}>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <section className={styles.empty}>
          <h2>No hay usuarios</h2>
          <p>Aún no se han registrado cuentas en la plataforma.</p>
        </section>
      ) : (
        <section className={styles.tableCard} aria-label="Listado de usuarios">
          <div className={styles.tableHeader}>
            <span>Usuario</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Acciones</span>
          </div>

          <div className={styles.rows}>
            {users.map((user) => {
              const isEditing = editingId === user.id //Bandera que determina si la fila actual está en modo edición

              return (
                <article className={styles.row} key={user.id}>
                  {/*Avatar con la primera letra del nombre o email*/}
                  <div className={styles.userCell}>
                    <div className={styles.avatar} aria-hidden="true">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{user.name || "Usuario sin nombre"}</strong>
                      <small>ID #{user.id}</small>
                    </div>
                  </div>

                  {/*Campo de Nombre: Muestra un input si está editando, o el email si es modo lectura*/}
                  {isEditing ? (
                    <div className={styles.editFields}>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Nombre"
                        aria-label="Editar nombre"
                      />
                    </div>
                  ) : (
                    <span className={styles.email}>{user.email || "Sin email"}</span>
                  )}

                  {/*Campo de Rol: Muestra un select si está editando, o el rol como texto si no*/}
                  {isEditing ? (
                    <div className={styles.roleField}>
                      <select name="role" value={editForm.role} onChange={handleEditChange} aria-label="Editar rol">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  ) : (
                    <span className={styles.role}>{String(user.role || "USER").toUpperCase()}</span>
                  )}

                  {/*Botones de acción dinámicos según el estado de la fila*/}
                  <div className={styles.actions}>
                    {isEditing ? (
                      <>
                        <button
                          className={styles.saveButton}
                          type="button"
                          onClick={() => handleSave(user)}
                          disabled={savingId === user.id}
                        >
                          {savingId === user.id ? "Guardando..." : "Guardar"}
                        </button>
                        <button className={styles.cancelButton} type="button" onClick={cancelEditing}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className={styles.editButton} type="button" onClick={() => startEditing(user)}>
                          <PencilLine size={16} aria-hidden="true" />
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          {deletingId === user.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminUsersPage //Exporta el componente
