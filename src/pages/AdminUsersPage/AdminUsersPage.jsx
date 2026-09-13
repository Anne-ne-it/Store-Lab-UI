import { useCallback, useEffect, useState } from "react"
import { PencilLine, Trash2 } from "lucide-react"
import { deleteUser, getUsers, updateUser } from "../../api/users.js"
import styles from "./AdminUsersPage.module.css"

const emptyEditForm = { name: "", email: "", role: "USER" }

function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [savingId, setSavingId] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const response = await getUsers()
      setUsers(Array.isArray(response) ? response : [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudieron cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function startEditing(user) {
    setEditingId(user.id)
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: String(user.role || "USER").toUpperCase(),
    })
    setError("")
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm(emptyEditForm)
    setError("")
  }

  function handleEditChange(event) {
    const { name, value } = event.target
    setEditForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSave(user) {
    const name = editForm.name.trim()
    const email = editForm.email.trim()
    const role = editForm.role.toUpperCase()

    if (!name || !email) {
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
      const updatedUser = response?.user ?? response?.data?.user ?? response?.data ?? response ?? {}

      setUsers((current) =>
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

  async function handleDelete(user) {
    if (!window.confirm(`¿Eliminar al usuario “${user.name || user.email || "usuario"}”?`)) return

    try {
      setDeletingId(user.id)
      setError("")
      await deleteUser(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id))
      if (editingId === user.id) cancelEditing()
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

      {error && <p className={styles.error} role="alert">{error}</p>}

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
              const isEditing = editingId === user.id

              return (
                <article className={styles.row} key={user.id}>
                  <div className={styles.userCell}>
                    <div className={styles.avatar} aria-hidden="true">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{user.name || "Usuario sin nombre"}</strong>
                      <small>ID #{user.id}</small>
                    </div>
                  </div>

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

export default AdminUsersPage
