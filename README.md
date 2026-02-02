# EcoDrive TermSpace - Federated Catalog

Web application built with Next.js to visualize and manage the EcoDrive TermSpace federated catalog of automotive terminology resources.

## 🚀 Features

- **Federated Catalog**: Display of all resources available in the EcoDrive ecosystem
- **Search & Filtering**: Search by name/description and filter by vocabularies
- **Detailed View**: Complete information for each catalog resource
- **Contact Form**: Request access to specific resources
- **Responsive Design**: Interface adapted to all devices
- **Dark Mode**: Support for light and dark themes
- **Docker Support**: Production-ready containerization
- **AWS ECR/ECS Ready**: Automated deployment to AWS

## 🛠️ Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Static typing for better safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **Axios**: HTTP client for API calls
- **Docker**: Container platform for deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional, for containerization)
- AWS CLI (optional, for deployment to AWS)

## 🔧 Installation

### Local Development

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Configure environment variables:

The `.env.local` file is already configured with the catalog endpoint:

```
CATALOG_API_URL=http://ecodrive.pangeanic.com:19195
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
# Build
npm run build
# or
yarn build

# Run
npm start
# or
yarn start
```

### Docker Mode

```bash
# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t ecodrive-catalog:latest .
docker run -p 3000:3000 ecodrive-catalog:latest
```

See [DOCKER_README.md](./DOCKER_README.md) for detailed Docker instructions.

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

## 🐳 Docker & AWS Deployment

### Quick Deploy to AWS ECR

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Build and push to AWS ECR
./scripts/push-to-ecr.sh us-east-1 ecodrive-catalog latest

# Deploy to ECS (if configured)
./scripts/deploy-ecs.sh us-east-1 ecodrive-cluster ecodrive-catalog-service
```

### Documentation

- **[DOCKER_README.md](./DOCKER_README.md)** - Complete Docker guide
- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - AWS ECR/ECS deployment guide
- **[INSTRUCCIONES.md](./INSTRUCCIONES.md)** - Spanish installation guide

## 📝 Future Enhancements

- [ ] Catalog pagination
- [ ] Results sorting
- [ ] Advanced filters
- [ ] Data export
- [ ] User authentication
- [ ] Admin panel
- [ ] Management API integration

## 📄 License

This project is part of the EcoDrive TermSpace ecosystem.

## 👥 Contact

For more information, visit the contact page in the application or contact the EcoDrive TermSpace team.

**Project Partners:**

- Pangeanic
- Universitat Jaume I de Castellón
