// ============================================================
//  CONFIGURACIÓN DEL PASE DE LISTA
//  Este es el ÚNICO archivo que necesitas editar.
// ============================================================

// 1) Pega aquí la configuración de tu app web de Firebase.
//    La obtienes en: Consola de Firebase > Configuración del proyecto
//    > Tus apps > App web > "SDK setup and configuration" > Config.
//    Estos datos son públicos por diseño: la seguridad real está
//    en las reglas de Firestore (archivo firestore.rules).
export const firebaseConfig = {
  apiKey: "AIzaSyBuNyDh8QZ6ies6Tasw6xwuPXynUoiqaAw",
  authDomain: "pase-de-lista-bdnu7a.firebaseapp.com",
  projectId: "pase-de-lista-bdnu7a",
  storageBucket: "pase-de-lista-bdnu7a.firebasestorage.app",
  messagingSenderId: "497154754153",
  appId: "1:497154754153:web:977920dbc5801c705504f8"
};

// 2) Dominio de los correos institucionales que pueden registrar asistencia.
//    Si lo cambias aquí, cámbialo también en firestore.rules.
export const DOMINIO = "uthh.edu.mx";

// 3) Proveedor de las cuentas institucionales:
//    "google"    -> si los correos de la universidad son de Google Workspace (Gmail)
//    "microsoft" -> si son de Microsoft 365 (Outlook)
export const PROVEEDOR = "google";

// 4) Cada cuántos segundos cambia el código del QR.
//    El alumno tiene entre 1 y 2 periodos para registrarse después de escanear.
export const ROTACION_SEGUNDOS = 60;
