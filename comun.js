// Código compartido por la página del alumno y la del profesor.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, DOMINIO, PROVEEDOR } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged };

// Inicia sesión con la cuenta institucional (ventana emergente).
export async function iniciarSesion() {
  let proveedor;
  if (PROVEEDOR === "microsoft") {
    proveedor = new OAuthProvider("microsoft.com");
    proveedor.setCustomParameters({ prompt: "select_account", domain_hint: DOMINIO });
  } else {
    proveedor = new GoogleAuthProvider();
    // "hd" sugiere a Google mostrar solo cuentas del dominio institucional.
    // Es solo una sugerencia: la validación real la hacen las reglas de Firestore.
    proveedor.setCustomParameters({ hd: DOMINIO, prompt: "select_account" });
  }
  return signInWithPopup(auth, proveedor);
}

export function cerrarSesion() {
  return signOut(auth);
}

export function esCorreoInstitucional(correo) {
  return typeof correo === "string" && correo.toLowerCase().endsWith("@" + DOMINIO);
}

// Traduce los errores más comunes de Firebase a mensajes claros.
export function mensajeDeError(e) {
  const codigo = e && e.code ? e.code : "";
  if (codigo === "auth/popup-closed-by-user" || codigo === "auth/cancelled-popup-request") {
    return "Cerraste la ventana de inicio de sesión. Vuelve a intentarlo.";
  }
  if (codigo === "auth/popup-blocked") {
    return "El navegador bloqueó la ventana de inicio de sesión. Permite las ventanas emergentes e inténtalo de nuevo.";
  }
  if (codigo === "auth/unauthorized-domain") {
    return "Este sitio no está autorizado en Firebase. El profesor debe agregar el dominio en Authentication > Configuración > Dominios autorizados.";
  }
  if (codigo === "permission-denied") {
    return "Permiso denegado por las reglas de seguridad.";
  }
  if (codigo === "unavailable") {
    return "Sin conexión con la base de datos. Revisa tu internet.";
  }
  return (e && e.message) ? e.message : String(e);
}

export function formatearHora(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return "…";
  return timestamp.toDate().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// Muestra solo la sección indicada (las demás quedan ocultas).
export function mostrar(idVisible, ids) {
  for (const id of ids) {
    document.getElementById(id).hidden = (id !== idVisible);
  }
}
