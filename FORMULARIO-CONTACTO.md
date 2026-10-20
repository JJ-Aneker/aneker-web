# Formulario de contacto - Instrucciones

## Cómo funciona

El formulario de contacto usa una función serverless de Vercel (`/api/contact.js`) que envía correos mediante nodemailer con SMTP.

### Configuración en Vercel (producción)

Las variables de entorno ya están configuradas en Vercel:
- `SMTP_HOST` - Servidor SMTP (ej: smtp.gmail.com)
- `SMTP_PORT` - Puerto (465 para SSL)
- `SMTP_USER` - Usuario SMTP (tu email)
- `SMTP_PASS` - Contraseña o app password
- `MAIL_TO` - Email destino (hola@aneker.es)

### Probar en local

#### 1. Instalar dependencias

```bash
npm install
```

Esto instalará nodemailer y las dependencias de Vercel.

#### 2. Crear archivo de configuración local

Copia el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales SMTP reales:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
MAIL_TO=hola@aneker.es
```

**Nota para Gmail:** Necesitas crear una "App Password" en tu cuenta de Google:
1. Ve a https://myaccount.google.com/security
2. Activa la verificación en 2 pasos
3. Ve a "App passwords" y genera una para "Mail"
4. Usa esa contraseña en `SMTP_PASS`

#### 3. Arrancar servidor de desarrollo

```bash
npx vercel dev
```

Esto arrancará:
- El servidor estático en http://localhost:3000
- Las funciones serverless en /api/*

#### 4. Probar el formulario

1. Abre http://localhost:3000 en tu navegador
2. Ve a la sección de contacto
3. Rellena el formulario con tus datos
4. Envía el mensaje
5. Verifica que te llega el correo a la dirección configurada en `MAIL_TO`

**Importante:** Verifica que el correo:
- Llega desde tu `SMTP_USER`
- El "Reply-To" es el email que pusiste en el formulario
- Contiene todos los campos correctamente
- El formato HTML se ve bien

#### 5. Verificar protecciones antispam

El sistema incluye varias protecciones:
- **Honeypot:** Campo oculto `_gotcha` - si viene relleno, no envía
- **Tiempo mínimo:** No acepta envíos hechos menos de 3s después de cargar la página
- **Validación de campos:** Nombre, email, mensaje y consentimiento obligatorios
- **Límites de longitud:** Protección contra intentos de inyección

### Estructura de archivos

```
/
├── api/
│   └── contact.js          # Función serverless que envía emails
├── index.html              # Formulario actualizado con fetch
├── package.json            # Dependencias (nodemailer)
├── .env.local              # Config local (NO hacer commit)
├── .env.local.example      # Ejemplo de configuración
└── .gitignore              # Incluye .env.local y node_modules
```

### Despliegue a producción

Una vez probado en local:

```bash
git add .
git commit -m "Implementa formulario de contacto funcional con API serverless"
git push origin main
```

Vercel desplegará automáticamente:
- Los archivos estáticos
- La función serverless en /api/contact
- Usará las variables de entorno configuradas en el dashboard de Vercel

### Solución de problemas

**Error: "Server configuration error"**
- Verifica que todas las variables de entorno estén configuradas en Vercel

**Error: "Failed to send message"**
- Revisa los logs en Vercel: Dashboard → tu proyecto → Functions → Logs
- Verifica las credenciales SMTP
- Si usas Gmail, asegúrate de usar una App Password, no tu contraseña normal

**El formulario no envía nada**
- Abre la consola del navegador (F12) y busca errores
- Verifica que `/api/contact` responda (debería devolver JSON)

**Los correos no llegan**
- Revisa la carpeta de spam
- Verifica que MAIL_TO sea correcto
- Prueba enviando a otro email para descartar filtros del servidor

### Fallback a mailto

Si JavaScript está desactivado o hay algún problema con la API, el formulario automáticamente usará `mailto:` como alternativa, abriendo el cliente de correo del usuario con el mensaje preparado.
