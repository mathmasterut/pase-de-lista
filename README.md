# Pase de lista con Firestore

Aplicación web para registrar asistencia escaneando un código QR. Los alumnos entran con su **correo institucional** y su nombre aparece **en tiempo real** en la pantalla del profesor.

Sirve como ejemplo práctico de una base de datos **NoSQL orientada a documentos** (Cloud Firestore) en la nube, usando solo el **plan gratuito Spark** de Firebase (sin tarjeta) y **GitHub Pages** para publicar la página.

---

## Cómo funciona

1. El profesor abre `profesor.html`, inicia sesión y abre un pase de lista. En pantalla aparece un **QR**.
2. El QR contiene la dirección de `index.html` con el identificador de la sesión y un **código que cambia cada 60 segundos**. Así, una foto del QR enviada por WhatsApp deja de servir en poco tiempo.
3. El alumno escanea el QR, entra con su cuenta `@uthh.edu.mx` y toca **"Estoy presente"**.
4. Firestore guarda un documento y la pantalla del profesor lo muestra al instante.

### Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página del alumno (se abre desde el QR) |
| `profesor.html` | Panel del profesor: abre sesiones, muestra el QR y la lista en vivo |
| `firebase-config.js` | **El único archivo que debes editar**: datos de tu proyecto de Firebase |
| `comun.js` | Código compartido (inicio de sesión, conexión a Firestore) |
| `estilos.css` | Diseño de ambas páginas |
| `firestore.rules` | Reglas de seguridad; se pegan en la consola de Firebase |

### Cómo se guardan los datos

```
profesores / {correo del profesor}            ← lo das de alta tú, a mano
sesiones / {id}                               ← materia, grupo, fecha, profesor, abierta
sesiones / {id} / privado / codigo            ← código secreto del QR (solo lo ve el profesor)
sesiones / {id} / asistencias / {uid alumno}  ← un documento por alumno
```

Ejemplo de un documento de asistencia:

```json
{
  "nombre": "Ana López",
  "correo": "ana.lopez@uthh.edu.mx",
  "hora": "2026-10-05T16:07:32Z",
  "codigo": "K7QM4P",
  "dispositivo": "Android"
}
```

### Qué protegen las reglas de seguridad

- Solo cuentas **@uthh.edu.mx** pueden registrar asistencia.
- Cada alumno solo puede registrar **su propia** asistencia; no puede registrar a otra persona.
- El registro solo se acepta si el pase de lista está **abierto** y el **código del QR es el vigente** (o el inmediato anterior).
- La hora la pone el **servidor**, no el celular, así que no se puede falsificar.
- Nadie puede **modificar ni borrar** una asistencia ya registrada.
- Solo el profesor dueño de la sesión ve la lista completa y el código secreto.

---

## Instalación (aproximadamente 1 hora, una sola vez)

### Paso 1. Crear el proyecto de Firebase

1. Entra a <https://console.firebase.google.com> con tu cuenta de Google.
2. **Crear un proyecto** → escribe un nombre, por ejemplo `pase-de-lista-uthh`.
3. Google Analytics: **desactívalo** (no se necesita) → **Crear proyecto**.
4. El proyecto queda en el plan **Spark (sin costo)**. No agregues tarjeta.

### Paso 2. Crear la base de datos Firestore

1. Menú izquierdo → **Compilación / Build** → **Firestore Database** → **Crear base de datos**.
2. Si te pregunta la edición, elige **Standard** (es la que tiene cuota gratuita).
3. Ubicación: elige una de **Estados Unidos** (por ejemplo `nam5` o `us-central1`). **No se puede cambiar después.**
4. Modo: **producción** → **Crear**.

### Paso 3. Pegar las reglas de seguridad

1. En Firestore Database, abre la pestaña **Reglas**.
2. Borra lo que haya, pega todo el contenido de `firestore.rules` y presiona **Publicar**.

> Si tu dominio no es `uthh.edu.mx`, cámbialo en la función `esInstitucional()` del archivo de reglas (los puntos se escriben como `[.]`) y también en `firebase-config.js`.

### Paso 4. Darte de alta como profesor

1. En Firestore Database, pestaña **Datos** → **Iniciar colección**.
2. ID de la colección: `profesores`.
3. ID del documento: **tu correo completo, en minúsculas** (por ejemplo `nombre.apellido@uthh.edu.mx`).
4. Agrega un campo `nombre` de tipo **string** con tu nombre → **Guardar**.

Repite este paso por cada profesor que vaya a usar la aplicación.

### Paso 5. Activar el inicio de sesión con Google

1. Menú → **Authentication** → **Comenzar**.
2. Pestaña **Método de acceso** → **Google** → **Habilitar**.
3. Elige un correo de asistencia del proyecto → **Guardar**.

### Paso 6. Registrar la app web y copiar la configuración

1. Rueda de engranaje (junto a "Descripción general") → **Configuración del proyecto**.
2. En **Tus apps**, presiona el ícono **`</>`** (Web).
3. Escribe un apodo (por ejemplo `pase-de-lista-web`). **No** marques Firebase Hosting → **Registrar app**.
4. Copia el bloque `firebaseConfig` que aparece y pégalo en `firebase-config.js`, reemplazando los valores de ejemplo.

> Estos datos (incluida la `apiKey`) son públicos por diseño y es normal que queden en GitHub. La seguridad la dan las reglas del paso 3.

### Paso 7. Publicar en GitHub Pages

1. En <https://github.com> crea un repositorio nuevo, **público**, por ejemplo `pase-de-lista`.
   (GitHub Pages es gratuito para repositorios públicos.)
2. En el repositorio: **Add file → Upload files** → arrastra **todos** los archivos de esta carpeta → **Commit changes**.
3. Ve a **Settings → Pages**.
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` y carpeta `/ (root)` → **Save**.
4. Espera 1 o 2 minutos. Tu sitio quedará en:
   `https://TU-USUARIO.github.io/pase-de-lista/`

### Paso 8. Autorizar el dominio de GitHub en Firebase

Sin este paso, el inicio de sesión mostrará el error `auth/unauthorized-domain`.

1. Firebase → **Authentication** → **Configuración / Settings** → **Dominios autorizados**.
2. **Agregar dominio** → escribe `TU-USUARIO.github.io` (sin `https://` y sin `/pase-de-lista`) → **Agregar**.

### Paso 9. Probar

1. En la computadora abre `https://TU-USUARIO.github.io/pase-de-lista/profesor.html` e inicia sesión.
2. Escribe materia y grupo → **Abrir y mostrar QR**.
3. Escanea el QR con tu celular, entra con una cuenta institucional y toca **Estoy presente**.
4. Tu nombre debe aparecer de inmediato en la computadora.

---

## Guion para la demostración en clase

1. **Proyecta `profesor.html`** y pide a los alumnos que escaneen el QR.
2. Mientras llegan los registros, señala el recuadro **"Así se guarda en Firestore"**: muestra la ruta y el JSON del último documento.
3. Abre en otra pestaña la **consola de Firestore** y navega a `sesiones → … → asistencias`: los documentos aparecen ahí también.
4. **Esquema flexible:** agrega a mano un campo nuevo a un documento (por ejemplo `"comentario": "llegó tarde"`) y explica que no hubo que modificar ninguna tabla.
5. **Seguridad:** pide a alguien que intente entrar con un Gmail personal o que use una foto vieja del QR. Las reglas lo rechazan.
6. **Tiempo real:** explica que la lista no se recarga; Firestore *avisa* a la página cuando llega un documento (`onSnapshot`).
7. Al final, **Cerrar pase de lista** y **Descargar CSV** para abrirlo en Excel.

---

## Límites del plan gratuito

| Recurso (por día) | Gratis | Consumo aproximado de una clase de 40 alumnos |
|---|---|---|
| Lecturas | 50 000 | unas 300 |
| Escrituras | 20 000 | unas 100 (40 asistencias + cambios de código) |
| Almacenamiento | 1 GiB total | menos de 1 MB por semestre |

Si se supera una cuota, Firestore deja de responder hasta el día siguiente; **nunca genera cobros** en el plan Spark.

---

## Solución de problemas

| Mensaje o síntoma | Causa y solución |
|---|---|
| `auth/unauthorized-domain` | Falta el paso 8: agrega `TU-USUARIO.github.io` a los dominios autorizados. |
| "El navegador bloqueó la ventana de inicio de sesión" | Permite ventanas emergentes para el sitio, o ábrelo en Chrome/Safari en lugar del navegador interno de WhatsApp o Instagram. |
| Google muestra **"Acceso bloqueado"** al entrar con la cuenta institucional | El administrador de Google Workspace de la universidad restringe aplicaciones externas. Pide a TI que permita la app (verás su nombre en el mensaje). |
| "Esta cuenta no está registrada como profesor" | Revisa el paso 4: el ID del documento debe ser tu correo exacto, en minúsculas. |
| "El código del QR ya cambió…" | El alumno tardó más de 1 a 2 minutos. Que vuelva a escanear el QR. Puedes ampliar `ROTACION_SEGUNDOS` en `firebase-config.js`. |
| La lista del profesor no carga y dice "Permiso denegado" | Las reglas no se publicaron (paso 3) o el dominio de las reglas no coincide con el tuyo. |

---

## Si los correos de la universidad son de Microsoft 365 (Outlook)

El inicio de sesión con Google solo funciona si las cuentas institucionales son de **Google Workspace**. Si son de Microsoft:

1. Registra una aplicación en el **Centro de administración de Microsoft Entra** (Azure) y obtén su *ID de aplicación* y un *secreto*. Normalmente lo hace el área de TI.
2. En Firebase → Authentication → Método de acceso → **Microsoft** → pega esos datos y copia la *URI de redirección* que te da Firebase de vuelta en Entra.
3. En `firebase-config.js` cambia `PROVEEDOR` a `"microsoft"`.

Las reglas de seguridad ya aceptan cuentas de Microsoft; no hay que cambiarlas.
