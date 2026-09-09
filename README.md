StoreLab UI

Frontend de StoreLab, una tienda online de surf y skate construida con React, Vite y Redux Toolkit. La interfaz utiliza un sistema de componentes reutilizables organizados por funcionalidad.


Características

•
Catálogo de productos con listado, categorías y detalle individual.

•
Autenticación mediante registro, inicio de sesión y sesión persistida en localStorage.

•
Rutas privadas para carrito, wishlist, perfil y checkout.

•
Carrito de compra gestionado con Redux Toolkit.

•
Wishlist gestionada con Redux Toolkit.

•
Reseñas de productos para usuarios autenticados.

•
Interceptor Axios para adjuntar automáticamente el token Bearer.

•
Diseño responsive para escritorio, tablet y móvil.

•
CSS Modules para encapsular los estilos de cada componente y página.

•
Sistema de tokens visuales centralizado en src/styles/variables.css.

•
Panel de administración preparado como extensión opcional mediante la ruta /admin.

Tecnologías

React: Construcción de la interfaz y componentes
Vite: Desarrollo local, HMR y build de producción
React Router: Navegación y protección de rutas
Redux Toolkit: Estado global de autenticación, carrito y wishlist
Axios: Cliente HTTP con interceptor de autenticación
Fetch API: Consultas de productos y reseñas
Lucide React: Iconos de la interfaz
CSS Modules:  Estilos aislados por componente
ESLint: Revisión estática del código




Requisitos

• Node.js 18 o superior.

• npm 9 o superior.

• Un backend StoreLab ejecutándose localmente o publicado.

Comprueba las versiones instaladas con:

Bash
node --version
npm --version



Instalación

Clona el repositorio y entra en la carpeta del frontend:

Bash
git clone <URL_DEL_REPOSITORIO>
cd Store-Lab-UI



Instala las dependencias:

Bash
npm install



Crea un archivo .env en la raíz del proyecto:

Plain Text
VITE_API_URL=http://localhost:3000



Inicia el servidor de desarrollo:

Bash
npm run dev



Vite mostrará la URL local, normalmente:

Plain Text
http://localhost:5173



Variables de entorno

Variable: VITE_API_URL
Obligatoria: Sí en entornos no locales
Ejemplo: http://localhost:3000
Descripción: URL base del backend, sin /api al final




El frontend usa http://localhost:3000 como valor predeterminado si VITE_API_URL no está definida.

La URL debe configurarse así:

Plain Text
VITE_API_URL=http://localhost:3000


No la configures así:

Plain Text
VITE_API_URL=http://localhost:3000/api



El código añade /api automáticamente en los módulos que lo necesitan.


Scripts disponibles

Bash
npm run dev       # Inicia Vite en modo desarrollo
npm run build     # Genera la versión de producción en dist/
npm run preview   # Sirve localmente el build de producción
npm run lint      # Ejecuta ESLint



Flujo recomendado antes de publicar:

Bash
npm run lint
npm run build
npm run preview



Estructura del proyecto

Plain Text
Store-Lab-UI/
├── public/                         # Activos públicos pequeños, si existen
├── src/
│   ├── api/                        # Funciones de comunicación con el backend
│   │   ├── auth.js                 # Registro, login y usuario actual
│   │   ├── axios.js                # Cliente Axios e interceptor Bearer
│   │   ├── cart.js                 # Operaciones relacionadas con carrito
│   │   ├── products.js             # Listado y detalle de productos
│   │   ├── reviews.js              # Lectura y creación de reseñas
│   │   └── wishlist.js             # Operaciones de wishlist
│   ├── components/                 # Componentes reutilizables
│   │   ├── Button/
│   │   ├── CartItem/
│   │   ├── CartSummary/
│   │   ├── Footer/
│   │   ├── FormInput/
│   │   ├── Header/
│   │   ├── Layout/
│   │   ├── PrivateRoute/
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── ReviewForm/
│   │   ├── ReviewList/
│   │   ├── StarRating/
│   │   └── WishlistButton/
│   ├── data/
│   │   └── mockProducts.js         # Datos de apoyo para desarrollo
│   ├── hooks/                      # Hooks de acceso y carga de datos
│   │   ├── UseProduct.js
│   │   ├── UseProducts.js
│   │   └── UseReviews.js
│   ├── pages/                      # Vistas asociadas a rutas
│   │   ├── CartPage/
│   │   ├── CheckoutSuccesPage/
│   │   ├── HomePage/
│   │   ├── LoginPage/
│   │   ├── NotFoundPage/
│   │   ├── ProductDetailPage/
│   │   ├── ProductsPage/
│   │   ├── ProfilePage/
│   │   ├── RegistrerPage/
│   │   └── WishlistPage/
│   ├── router/
│   │   └── index.jsx                # Router y rutas privadas
│   ├── store/
│   │   ├── authSlice.js             # Usuario, token, login y registro
│   │   ├── cartSlice.js              # Estado del carrito
│   │   ├── index.js                  # Configuración del store
│   │   └── wishlistSlice.js          # Estado de favoritos
│   ├── styles/
│   │   ├── index.css                # Reset y estilos globales
│   │   └── variables.css            # Design tokens StoreLab
│   ├── App.jsx
│   └── main.jsx                     # Punto de entrada y Provider Redux
├── .env                             # Variables locales, no subir a Git
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js



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




Si utilizas rutas de React Router, configura el hosting para devolver index.html como fallback en las rutas que no correspondan a un archivo físico.