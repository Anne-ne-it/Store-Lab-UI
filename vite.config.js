import { defineConfig } from 'vite' //Importa la función defineConfig de Vite para configurar el proyecto
import react from '@vitejs/plugin-react' //Importa el plugin de React que permite a Vite trabajar con React

export default defineConfig({ //Exporta la configuración de Vite para que pueda utilizarse en el proyecto
  plugins: [react()], //Activa el plugin de React en Vite
})