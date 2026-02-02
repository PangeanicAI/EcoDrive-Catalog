# 📘 Instrucciones de Instalación y Uso - EcoDrive Catálogo

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

Primero, asegúrate de tener Node.js 18 o superior instalado. Luego ejecuta:

```bash
npm install
```

### 2. Verificar Configuración

El archivo `.env.local` ya está configurado con el endpoint del catálogo:

```
CATALOG_API_URL=http://ecodrive.pangeanic.com:19195
```

Si necesitas cambiar el endpoint, edita este archivo.

### 3. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto Creado

```
EcoDrive-Catalogo/
│
├── app/                          # Directorio principal de Next.js 14 (App Router)
│   ├── about/                    # Página "Sobre Nosotros"
│   │   └── page.tsx
│   ├── api/                      # API Routes
│   │   └── catalog/
│   │       └── route.ts          # Endpoint proxy para el catálogo
│   ├── catalog/[id]/             # Página dinámica de detalle
│   │   └── page.tsx
│   ├── contact/                  # Página de contacto
│   │   └── page.tsx
│   ├── error.tsx                 # Página de error global
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   ├── loading.tsx               # Componente de carga
│   ├── not-found.tsx             # Página 404
│   └── page.tsx                  # Página de inicio (catálogo)
│
├── components/                   # Componentes reutilizables
│   ├── CatalogCard.tsx           # Tarjeta de recurso del catálogo
│   ├── ContactForm.tsx           # Modal de formulario de contacto
│   ├── Footer.tsx                # Pie de página
│   ├── Header.tsx                # Cabecera con navegación
│   └── SearchBar.tsx             # Barra de búsqueda y filtros
│
├── lib/                          # Utilidades y librerías
│   └── api.ts                    # Funciones para llamadas a la API
│
├── types/                        # Definiciones TypeScript
│   └── catalog.ts                # Tipos para los datos del catálogo
│
├── public/                       # Archivos estáticos
│   └── favicon.ico
│
├── .env.local                    # Variables de entorno
├── .eslintrc.json               # Configuración ESLint
├── .gitignore                   # Archivos ignorados por Git
├── next.config.mjs              # Configuración de Next.js
├── next-env.d.ts                # Tipos de Next.js
├── package.json                 # Dependencias y scripts
├── postcss.config.mjs           # Configuración PostCSS
├── README.md                    # Documentación principal
├── tailwind.config.ts           # Configuración Tailwind CSS
└── tsconfig.json                # Configuración TypeScript
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Página Principal (Catálogo)

- Visualización en grid de todos los recursos
- Búsqueda en tiempo real por nombre o descripción
- Filtrado por vocabularios
- Contador de resultados
- Diseño responsive
- Estados de carga y error
- Datos de demostración si el API no está disponible

### ✅ Página de Detalle

- Información completa del recurso
- Visualización de propiedades técnicas
- Información de metadatos
- Botón para solicitar acceso
- Modal con formulario de contacto
- Navegación de vuelta al catálogo

### ✅ Página "Sobre Nosotros"

- Información sobre EcoDrive
- Misión y valores de la plataforma
- Grid de valores con iconos
- Información tecnológica

### ✅ Página de Contacto

- Formulario de contacto general
- Información de contacto (email, teléfono, ubicación)
- Validación de formulario
- Mensaje de confirmación

### ✅ Componentes Globales

- Header con navegación responsive
- Footer con enlaces y redes sociales
- Menú móvil hamburguesa
- Soporte para modo oscuro

---

## 🔌 Integración con la API

### Endpoint Principal

```
GET http://ecodrive.pangeanic.com:19195/federatedcatalog
```

### Procesamiento de Datos

El archivo `lib/api.ts` incluye lógica para procesar diferentes formatos de respuesta del catálogo EDC:

1. **Arrays directos**: `[item1, item2, ...]`
2. **Estructura DCAT**: `{ "dcat:dataset": [...] }`
3. **Estructura JSON-LD**: `{ "@graph": [...] }`
4. **Objetos individuales**: `{ "@id": "...", ... }`

### Datos de Demostración

Si el endpoint no está disponible, la aplicación muestra 6 recursos de demostración que incluyen:

- Datasets de movilidad
- APIs de calidad del aire
- Modelos de ML
- Bases de datos
- Servicios web
- Datos climáticos

---

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.ts` para personalizar la paleta de colores:

```typescript
colors: {
  primary: {
    50: '#f0fdf4',    // Tono más claro
    // ...
    900: '#14532d',   // Tono más oscuro
  },
}
```

### Cambiar Endpoint

Edita `.env.local`:

```
CATALOG_API_URL=http://tu-endpoint-aqui:puerto
```

### Modificar Contenido

- **Sobre Nosotros**: Edita `app/about/page.tsx`
- **Información de Contacto**: Edita `app/contact/page.tsx`
- **Footer**: Edita `components/Footer.tsx`

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila la aplicación
npm start            # Ejecuta la aplicación compilada

# Utilidades
npm run lint         # Ejecuta el linter
```

---

## 🔧 Solución de Problemas

### El catálogo no carga

1. Verifica que el endpoint esté accesible:
   ```bash
   curl http://ecodrive.pangeanic.com:19195/federatedcatalog
   ```
2. Si el endpoint no está disponible, la aplicación mostrará datos de demostración
3. Revisa la consola del navegador para ver errores

### Errores de compilación

```bash
# Limpia caché y reinstala
rm -rf node_modules .next
npm install
npm run dev
```

### Problemas con TypeScript

```bash
# Verifica la configuración
npx tsc --noEmit
```

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Instala Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Despliega:
   ```bash
   vercel
   ```

### Docker

Puedes crear un `Dockerfile` basado en la imagen oficial de Node.js:

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📝 Próximas Mejoras Sugeridas

- [ ] **Autenticación**: Integrar sistema de login/registro
- [ ] **Paginación**: Para catálogos con muchos elementos
- [ ] **Filtros Avanzados**: Por fecha, tipo, formato, etc.
- [ ] **Exportación**: Descargar resultados en CSV/JSON
- [ ] **Favoritos**: Guardar recursos favoritos
- [ ] **Comentarios**: Sistema de reviews/comentarios
- [ ] **Analytics**: Tracking de búsquedas y visitas
- [ ] **Notificaciones**: Avisos de nuevos recursos
- [ ] **API Documentation**: Documentación interactiva con Swagger

---

## 📞 Soporte

Para problemas o preguntas:

1. Revisa la documentación en `README.md`
2. Consulta este archivo de instrucciones
3. Contacta al equipo de desarrollo

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] Servidor de desarrollo funcionando
- [ ] Aplicación accesible en http://localhost:3000
- [ ] Catálogo cargando correctamente (o datos demo visibles)
- [ ] Navegación entre páginas funcionando
- [ ] Búsqueda y filtros operativos

---

¡Listo! Tu aplicación EcoDrive Catálogo está configurada y lista para usar. 🎉
