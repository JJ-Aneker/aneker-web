# Guía para crear nuevos artículos del Cuaderno

Esta guía describe el estilo y formato editorial para mantener consistencia en todos los artículos.

## 🚀 Proceso rápido (copiar template)

**La forma más fácil de crear un artículo nuevo:**

1. **Copiar el template base:**
   ```bash
   cp cuaderno/agentes-que-leen-facturas/index.html cuaderno/[nuevo-slug]/index.html
   ```
   ⚠️ **Importante:** Usar siempre `agentes-que-leen-facturas/index.html` como base, NO los otros artículos.

2. **Actualizar metadata** (buscar y reemplazar):
   - Título del artículo
   - URL canónica (`/cuaderno/[nuevo-slug]/`)
   - Descripción/dek
   - Imagen hero y thumbnail
   - Fecha de publicación

3. **Personalizar contenido:**
   - Byline (fecha)
   - Título H1 y dek (dos colores: primary + secondary)
   - Imagen hero (cambiar src)
   - Contenido del article-body
   - Sidebar "Historias del día" (actualizar links)

4. **Añadir al índice:**
   - Editar `cuaderno/index.html`
   - Añadir tarjeta del nuevo artículo en el grid

## ⚠️ Reglas CSS críticas

### Imágenes en article-body
**DEBE incluirse siempre esta regla:**
```css
.article-body img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 32px 0;
  border-radius: 8px;
}
```
Sin `max-width: 100%`, las imágenes grandes rompen el layout de 2 columnas.

### Layout de 2 columnas
```css
.article-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 60px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 60px;
  align-items: start;
}
```
- Columna izquierda (contenido): `1fr` (flexible)
- Columna derecha (sidebar): `340px` (fijo)

## Estructura de un artículo

### 1. Header del artículo
```html
<div class="article-byline">
  <div class="author-avatar">A</div>
  <div class="byline-text">
    <div class="byline-author">Aneker</div>
    <div class="byline-date">[FECHA]</div>
  </div>
</div>
```

### 2. Título y dek
```html
<h1 class="article-title">[TÍTULO DEL ARTÍCULO]</h1>

<p class="article-dek">
  <span class="primary">[Primera parte del subtítulo],</span>
  <span class="secondary">[segunda parte destacada].</span>
</p>
```

**Guía del dek:**
- Divide el subtítulo en dos partes: contextual (primary) + gancho (secondary)
- Primary: negro, describe el tema
- Secondary: rojo, resalta el valor o promesa

### 3. Imagen hero
```html
<img class="article-hero-img" src="/img/cuaderno/[nombre].webp" alt="[descripción]">
```

**Especificaciones de imagen:**
- Formato: WebP
- Ancho: 2000px mínimo
- Ratio: 16:9
- Peso: < 350 KB
- Nombre: `[slug-articulo]-hero.webp`

### 4. Pull quotes
Para destacar citas o ideas clave:
```html
<blockquote class="pull-quote">
  "Texto destacado que resume una idea clave del artículo."
</blockquote>
```

**Cuándo usar:**
- Máximo 2-3 por artículo
- Para ideas que quieres que el lector recuerde
- Frases de 1-2 líneas, máximo 140 caracteres

### 5. Sidebar "Historias del día"
Incluir al final del `<article>`, antes de `</main>`:

```html
<aside class="article-sidebar">
  <div class="sidebar-section">
    <h3 class="sidebar-title">Historias del día</h3>
    
    <a href="/cuaderno/[slug]/" class="sidebar-article">
      <div class="sidebar-article-thumb">
        <img src="/img/cuaderno/[nombre]-thumb.webp" alt="[título]" width="400" height="225" loading="lazy">
      </div>
      <div class="sidebar-article-meta">
        <span>[fecha corta]</span>
        <span>•</span>
        <span>[X min]</span>
      </div>
      <h4 class="sidebar-article-title">[Título del artículo]</h4>
      <p class="sidebar-article-excerpt">[Extracto de 1-2 líneas]</p>
    </a>
    
    <!-- Repetir para 2-3 artículos relacionados -->
  </div>
</aside>
```

**Selección de artículos relacionados:**
- 2-3 artículos máximo
- Mismo tema o categoría
- Los más recientes o populares

## Tipografía y formato

### Jerarquía de títulos
- `<h1>` (article-title): 42px, bold, solo uno por página
- `<h2>`: 28px, bold, secciones principales
- `<h3>`: 22px, bold, subsecciones

### Párrafos
- Tamaño: 17px
- Interlineado: 1.7
- Máximo 3-4 líneas por párrafo
- Espacio entre párrafos: 24px

### Listas
Usar `<ul>` o `<ol>` dentro de `.article-body`:
```html
<ul>
  <li><strong>Punto destacado:</strong> explicación</li>
  <li><strong>Otro punto:</strong> más contexto</li>
</ul>
```

## CSS Classes disponibles

### Layout
- `.article-layout`: contenedor principal (2 columnas)
- `.article-main`: columna principal del contenido
- `.article-sidebar`: sidebar derecho (sticky)

### Contenido
- `.article-byline`: autor + fecha
- `.article-title`: título principal
- `.article-dek`: subtítulo con dos colores
- `.article-hero-img`: imagen principal
- `.article-body`: contenedor del texto
- `.pull-quote`: cita destacada

### Sidebar
- `.sidebar-section`: contenedor de sección
- `.sidebar-title`: título de sección
- `.sidebar-article`: tarjeta de artículo
- `.sidebar-article-thumb`: thumbnail
- `.sidebar-article-title`: título
- `.sidebar-article-excerpt`: extracto

## Imágenes requeridas

Para cada artículo crear 2 imágenes:

### 1. Hero (principal)
- **Nombre:** `[slug]-hero.webp`
- **Dimensiones:** 2000×1125px (16:9)
- **Uso:** Imagen principal del artículo
- **Peso:** < 350 KB

### 2. Thumbnail (miniatura)
- **Nombre:** `[slug]-thumb.webp`
- **Dimensiones:** 800×450px (16:9)
- **Uso:** Índice del cuaderno y sidebar
- **Peso:** < 100 KB

### Procesamiento de imágenes
Usar el script `process_images.py` en la raíz:
```bash
python process_images.py
```

## Metadata del artículo

Actualizar en el `<head>`:

```html
<title>[Título] · Aneker</title>
<meta name="description" content="[Dek del artículo]">
<link rel="canonical" href="https://aneker.es/cuaderno/[slug]/">

<!-- Open Graph -->
<meta property="og:title" content="[Título]">
<meta property="og:description" content="[Dek]">
<meta property="og:image" content="https://aneker.es/img/cuaderno/[slug]-hero.webp">

<!-- JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Título]",
  "image": "https://aneker.es/img/cuaderno/[slug]-hero.webp",
  "datePublished": "[YYYY-MM-DD]",
  "author": {
    "@type": "Organization",
    "name": "Aneker"
  }
}
</script>
```

## Checklist antes de publicar

- [ ] Avatar y fecha actualizados
- [ ] Título claro y descriptivo (< 60 caracteres)
- [ ] Dek dividido en primary + secondary
- [ ] Imagen hero optimizada (< 350 KB)
- [ ] Thumbnail creado (< 100 KB)
- [ ] Pull quotes relevantes (2-3 máximo)
- [ ] Sidebar con 2-3 artículos relacionados
- [ ] Metadata og:image actualizada
- [ ] Schema JSON-LD con fecha correcta
- [ ] Añadido al índice `/cuaderno/index.html`
- [ ] Probado en móvil (layout responsive)

## Tono editorial

- **Directo y práctico:** evitar jerga innecesaria
- **Orientado a decisores:** enfoque en qué hacer, no solo qué es
- **Sin humo:** promesas realistas, casos reales
- **Voz activa:** preferir "hacemos X" vs "X se hace"
- **Ejemplos concretos:** números, casos, anécdotas (sin nombres de cliente)

## Longitud recomendada

- **Título:** 40-60 caracteres
- **Dek:** 100-140 caracteres
- **Artículo:** 800-1500 palabras (5-8 min lectura)
- **Párrafos:** 2-4 líneas máximo
- **Pull quote:** 1-2 líneas (< 140 caracteres)

---

## 🐛 Problemas comunes y soluciones

### El sidebar se ve cortado o fuera de pantalla
**Causa:** Imágenes sin `max-width: 100%` desbordan y empujan el sidebar.  
**Solución:** Verificar que existe la regla CSS para `.article-body img` (ver arriba).

### El layout no se ve de 2 columnas
**Causa 1:** Falta el contenedor `.article-layout` o está mal cerrado.  
**Solución:** Verificar que `<div class="article-layout">` contiene tanto `<article class="article-main">` como `<aside class="article-sidebar">`.

**Causa 2:** CSS del grid no se aplicó correctamente.  
**Solución:** Verificar que existe `.article-layout { display: grid; grid-template-columns: 1fr 340px; }`.

### Cambios no se ven en Vercel
**Causa:** Caché del navegador o de Vercel.  
**Solución:** 
- Recargar con Ctrl+F5 (fuerza recarga sin caché)
- O abrir en ventana incógnito
- Esperar 1-2 minutos después del push para que Vercel despliegue

---

**Última actualización:** Octubre 2026  
**Template base:** `agentes-que-leen-facturas/index.html`  
**Mantenido por:** Equipo Aneker
