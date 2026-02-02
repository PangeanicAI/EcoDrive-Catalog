# EcoDrive - Catálogo Federado

Aplicación web desarrollada con Next.js para visualizar y gestionar el catálogo federado de conectores EcoDrive.

## 🚀 Características

- **Catálogo Federado**: Visualización de todos los recursos disponibles en el ecosistema EcoDrive
- **Búsqueda y Filtrado**: Búsqueda por nombre/descripción y filtrado por vocabularios
- **Vista Detallada**: Información completa de cada recurso del catálogo
- **Formulario de Contacto**: Solicitud de acceso a recursos específicos
- **Diseño Responsive**: Interfaz adaptada a todos los dispositivos
- **Modo Oscuro**: Soporte para tema claro y oscuro

## 🛠️ Tecnologías

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Framework de estilos utility-first
- **React Icons**: Biblioteca de iconos
- **Axios**: Cliente HTTP para llamadas a la API

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn

## 🔧 Instalación

1. Instalar dependencias:

```bash
npm install
# o
yarn install
```

2. Configurar variables de entorno:

El archivo `.env.local` ya está configurado con el endpoint del catálogo:

```
CATALOG_API_URL=http://ecodrive.pangeanic.com:19195
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción

```bash
# Compilar
npm run build
# o
yarn build

# Ejecutar
npm start
# o
yarn start
```

## 📁 Estructura del Proyecto

```
EcoDrive-Catalogo/
├── app/                    # Páginas de Next.js (App Router)
│   ├── about/             # Página "Sobre Nosotros"
│   ├── catalog/[id]/      # Página de detalle del catálogo
│   ├── contact/           # Página de contacto
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio (catálogo)
├── components/            # Componentes reutilizables
│   ├── CatalogCard.tsx    # Tarjeta de catálogo
│   ├── ContactForm.tsx    # Formulario de contacto modal
│   ├── Footer.tsx         # Pie de página
│   ├── Header.tsx         # Cabecera/navegación
│   └── SearchBar.tsx      # Barra de búsqueda y filtros
├── lib/                   # Utilidades y funciones
│   └── api.ts            # Funciones para llamadas a la API
├── types/                 # Definiciones de tipos TypeScript
│   └── catalog.ts        # Tipos del catálogo
└── public/               # Archivos estáticos
```

## 🌐 Páginas

### Inicio (/)

- Muestra el catálogo completo de recursos
- Búsqueda por nombre o descripción
- Filtrado por vocabularios
- Vista en grid responsive

### Detalle del Catálogo (/catalog/[id])

- Información completa del recurso
- Propiedades técnicas
- Formulario de solicitud de acceso

### Sobre Nosotros (/about)

- Información sobre EcoDrive
- Misión y valores
- Tecnología utilizada

### Contacto (/contact)

- Formulario de contacto general
- Información de contacto
- Ubicación

## 🔌 API

La aplicación consume el endpoint del catálogo federado:

```
GET http://ecodrive.pangeanic.com:19195/federatedcatalog
```

### Formato de Datos

La aplicación está preparada para procesar diferentes formatos de respuesta del catálogo EDC:

- Arrays directos
- Objetos con `dcat:dataset`
- Objetos con `@graph`
- Objetos individuales

### Datos de Demostración

Si el endpoint no está disponible, la aplicación muestra datos de demostración para facilitar el desarrollo y testing.

## 🎨 Personalización

### Colores

Los colores principales se pueden modificar en `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f0fdf4',
    // ... más tonos
    900: '#14532d',
  },
}
```

### Endpoint de la API

Para cambiar el endpoint del catálogo, modifica el archivo `.env.local`:

```
CATALOG_API_URL=tu_endpoint_aqui
```

## 📝 Próximas Mejoras

- [ ] Paginación del catálogo
- [ ] Ordenamiento de resultados
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Autenticación de usuarios
- [ ] Panel de administración
- [ ] Integración con APIs de management

## 📄 Licencia

Este proyecto es parte del ecosistema EcoDrive.

## 👥 Contacto

Para más información, visita la página de contacto en la aplicación o contacta con el equipo de EcoDrive.
