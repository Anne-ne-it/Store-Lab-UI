# StoreLab UI

StoreLab UI es el frontend de una tienda online especializada en surf, skate y cultura urbana. La aplicación está construida con React + Vite y conecta con un backend real para gestionar autenticación, catálogo, carrito, wishlist, reseñas y panel de administración.

## Descripción del proyecto

La aplicación permite:

- Explorar productos por categoría y ver detalle individual.
- Registrar e iniciar sesión como usuario.
- Gestionar un carrito con cantidades y resumen del pedido.
- Guardar productos en favoritos.
- Dejar reseñas con valoración.
- Acceder a un panel de administración para gestionar productos y usuarios.
- Visualizar una experiencia de compra moderna y responsive.

## Stack tecnológico

- React 19
- Vite 8
- React Router DOM
- Redux Toolkit
- Axios
- Lucide React
- CSS Modules
- ESLint

## Funcionalidades principales

- Catálogo de productos con diseño responsive.
- Búsqueda y visualización por categorías.
- Páginas de detalle de producto.
- Gestión de sesión y autenticación.
- Carrito persistente en localStorage.
- Wishlist con integración de Redux.
- Reseñas y valoración media de productos.
- Panel de administración para catálogo y usuarios.
- Integración con backend real mediante API REST.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Backend StoreLab en ejecución o desplegado

Comprueba tu entorno con:

```bash
node --version
npm --version
```

## Instalación

1. Clona el repositorio:

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

> Nota: la URL debe apuntar al backend sin incluir `/api` al final. El frontend agrega esa ruta internamente cuando hace las llamadas.

4. Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

La app suele estar disponible en:

```text
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Descripción de cada script

- `npm run dev`: inicia el entorno de desarrollo con Vite.
- `npm run build`: genera el build de producción en la carpeta `dist`.
- `npm run preview`: sirve el build para comprobar la versión final localmente.
- `npm run lint`: analiza el código con ESLint.

## Variables de entorno

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | Sí | URL base del backend, por ejemplo `http://localhost:3000` |

## Estructura del proyecto

```text
Store-Lab-UI/
├── src/
│   ├── api/                 # Llamadas HTTP al backend
│   ├── components/          # Componentes reutilizables
│   ├── data/                # Datos de prueba / mock
│   ├── hooks/               # Hooks personalizados
│   ├── pages/               # Páginas principales de la app
│   ├── router/              # Configuración de rutas
│   ├── store/               # Redux slices y store global
│   ├── styles/              # Variables y estilos globales
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── dist/                   # Build generado
```

## Rutas principales

- `/` — Home
- `/products` — Catálogo
- `/products/:id` — Detalle de producto
- `/cart` — Carrito
- `/wishlist` — Productos favoritos
- `/profile` — Perfil del usuario
- `/login` — Inicio de sesión
- `/register` — Registro
- `/admin` — Panel de administración

## Panel de administración

El proyecto incluye una zona privada para gestión del negocio, con acceso restringido a usuarios administradores. Desde ahí se puede:

- Gestionar productos
- Crear, editar y eliminar productos
- Gestionar usuarios
- Acceder a vistas internas del negocio


## Recomendación previa a despliegue

Antes de publicar la aplicación conviene ejecutar:

```bash
npm run lint
npm run build
```

## Autor

Ane Amiano Ibero, The Bridge Student. Proyecto StoreLab Backend.




Rutas de la aplicación

Rutas públicas

Ruta
Página
/       Página de inicio
/products       Catálogo de productos
/products/:productId        Detalle de un producto
/login      Inicio de sesión
/register       Registro de usuario




Rutas privadas

Estas rutas requieren un token válido en localStorage:

Ruta
Página
/cart
Carrito
/wishlist
Lista de deseos
/profile
Perfil del usuario
/checkout
Confirmación del checkout




Si no existe un token, PrivateRoute redirige al usuario a /login y conserva la ubicación de origen en el estado de navegación.

Ruta opcional de administración
El panel de administración puede añadirse con los archivos de la entrega storelab-admin-files. Esa extensión incorpora:

•src/components/AdminRoute/AdminRoute.jsx.

•src/pages/AdminPage/AdminPage.jsx.

•Selector selectIsAdmin en authSlice.js.

•Ruta protegida /admin.

•Enlace ADMIN visible solo para usuarios con rol ADMIN.

Estado global

El store Redux se configura en src/store/index.js:

Plain Text
{
  auth: {
    token,
    user,
    loading,
    error
  },
  cart: {
    items
  },
  wishlist: {
    items
  }
}



Autenticación

El token y el usuario se guardan en:

Plain Text
localStorage.token
localStorage.user



El interceptor de src/api/axios.js añade el token a las peticiones autenticadas:

Plain Text


Authorization: Bearer <token>



Cuando el backend devuelve 401, el interceptor ejecuta logout( ) y elimina la sesión local.

Rol de usuario

Para el panel de administración, el backend debe devolver el rol dentro del usuario:

JSON


{
  "id": 1,
  "email": "admin@storelab.com",
  "role": "ADMIN"
}



Se recomienda mantener una única convención de mayúsculas para los roles: USER y ADMIN.

Contrato esperado del backend

El frontend espera que el backend esté disponible en VITE_API_URL.

Productos

Plain Text


GET /api/products
GET /api/products/:productId



Para filtrar por categoría:

Plain Text


GET /api/products?category=Surf



El listado debe devolver un array JSON:

JSON


[
  {
    "id": 1,
    "name": "Tabla Ocean Pro",
    "category": "Surf",
    "description": "Tabla para olas medianas.",
    "price": 499.99,
    "image": "https://example.com/product.jpg"
  }
]



Autenticación

Plain Text


POST /api/auth/register
POST /api/auth/login
GET /me



Registro y login deben devolver esta forma:

JSON


{
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@email.com",
      "role": "USER"
    },
    "token": "jwt-token"
  }
}



Reseñas

Plain Text


GET /api/reviews/product/:productId
POST /api/reviews



La creación requiere autenticación:

JSON


{
  "productId": 1,
  "rating": 5,
  "comment": "Muy buena tabla."
}



CORS

El backend debe permitir el origen del frontend en desarrollo:

Plain Text


http://localhost:5173



Si Vite se inicia en otro puerto, añade ese origen a la configuración CORS del backend.

Error 500 al cargar productos

Si el navegador muestra:

Plain Text


Failed to load resource: the server responded with a status of 500 (Internal Server Error ) (products)



comprueba lo siguiente:

1.
El backend está ejecutándose.

2.
VITE_API_URL apunta al backend correcto.

3.
La petición final es GET /api/products.

4.
El backend devuelve 200 aunque la lista esté vacía.

5.
La variable SUPABASE_URL del backend contiene solo la URL raíz del proyecto:

Plain Text


SUPABASE_URL=https://tu-proyecto.supabase.co



No debe contener /rest/v1/, porque el SDK de Supabase añade esa ruta automáticamente.

1.
La tabla de Supabase se llama products.

2.
Las políticas RLS permiten lectura pública si se usa la clave anon.

3.
El log del backend no muestra Invalid path specified in request URL.

Prueba directamente el endpoint:

Bash


curl -i http://localhost:3000/api/products



La respuesta correcta es similar a:

Plain Text


HTTP/1.1 200 OK



JSON


[]



Un array vacío indica que la conexión funciona pero no hay registros visibles. No es un error HTTP.

Sistema visual

Los tokens de diseño viven en src/styles/variables.css.

Paleta

•
Océano: --color-primary.

•
Coral: --color-secondary.

•
Arena: --color-accent.

•
Fondo principal: --color-bg-main.

•
Texto principal: --color-text-main.

•
Texto secundario: --color-text-secondary.

Glassmorphism

•
--glass-bg y --glass-bg-strong.

•
--glass-border.

•
--glass-blur.

•
--shadow-glass.

Reglas para nuevos módulos CSS

Utiliza siempre los tokens existentes:

CSS


.panel {
  padding: var(--spacing-lg );
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glass);
}



Evita introducir colores hexadecimales nuevos si existe un token equivalente.

Desarrollo de nuevas funcionalidades

1.
Crea o actualiza la página correspondiente en src/pages/.

2.
Extrae piezas reutilizables a src/components/.

3.
Añade las peticiones HTTP en src/api/.

4.
Añade un hook en src/hooks/ si la carga tiene estados de loading, error y data.

5.
Añade una ruta en src/router/index.jsx.

6.
Usa PrivateRoute para páginas que requieren sesión.

7.
Añade el estado global a Redux solo si debe compartirse entre varias zonas de la aplicación.

8.
Conserva los tokens de src/styles/variables.css.

9.
Ejecuta lint y build antes de crear un commit.

Buenas prácticas de seguridad

•
No subas .env al repositorio.

•
No incluyas claves privadas en variables VITE_*.

•
Valida permisos en el backend; ocultar un enlace en el frontend no protege una ruta por sí solo.

•
El backend debe validar el JWT, el rol y los permisos de cada operación sensible.

•
No confíes en el precio, el rol o el userId enviados por el cliente.

Despliegue

Genera el build:

Bash


npm run build



El resultado queda en dist/.

Configura en el proveedor de hosting:

Configuración
Valor
Build command
npm run build
Output directory
dist
Node version
18 o superior
Variable
VITE_API_URL=https://tu-backend.com