# EcoDrive TermSpace - Federated Catalog

Web application built with Next.js to visualize and manage the EcoDrive TermSpace federated catalog of automotive terminology resources.

## 🚀 Features

- **Federated Catalog**: Display of all resources available in the EcoDrive ecosystem
- **Search & Filtering**: Search by name/description and filter by vocabularies
- **Detailed View**: Complete information for each catalog resource
- **Static Catalog Source**: Data loaded from `data/catalog.json`
- **MinIO Downloads**: Secure file downloads using signed URLs
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

Configure `.env.local` with MinIO credentials:

```
MINIO_ENDPOINT=http://ecodrive.pangeanic.com:9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=ecodrive-catalog
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

The application reads catalog data from a static file:

```
data/catalog.json
```

To add new resources, append objects with the same structure in that file.

### Download Endpoint

Each item can define a downloadable object:

```json
"download": {
  "objectKey": "catalog/my-resource.zip",
  "fileName": "my-resource.zip",
  "label": "Download resource"
}
```

The detail page button calls:

```
GET /api/catalog/:id/download
```

and the backend generates a signed MinIO URL with your `.env.local` configuration.

## 🎨 Customization

### Colors

Main colors can be modified in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f0fdf4',
    // ... more shades
    900: '#14532d',
  },
}
```

### Static Catalog

Edit `data/catalog.json` to populate your full catalog.

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
