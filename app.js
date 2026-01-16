// 1. IMPORT FIREBASE SDK DENGAN CDN (WAJIB UNTUK BROWSER)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. KONFIGURASI FIREBASE KAMU
const firebaseConfig = {
  apiKey: "AIzaSyBOBoKSfYRz_3z__n0CPGplfLh7I2Qku_I",
  authDomain: "academysawit.firebaseapp.com",
  projectId: "academysawit",
  storageBucket: "academysawit.firebasestorage.app",
  messagingSenderId: "144501931796",
  appId: "1:144501931796:web:33ed8b6131a21bf9dacc01",
  measurementId: "G-24J9Y7M979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- FUNGSI LOGIN ---
window.handleLogin = async () => {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    if (!email || !pass) return alert("Masukan email dan password!");

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "profile.html";
    } catch (error) {
        alert("Login Gagal: " + error.message);
    }
};

// --- FUNGSI DAFTAR ---
window.handleRegister = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if (!name || !email || !pass) return alert("Mohon lengkapi data!");
    if (pass.length < 6) return alert("Password minimal 6 karakter!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Simpan data ke Firestore
        await setDoc(doc(db, "members", user.uid), {
            name: name,
            email: email,
            role: "NEWBIE",
            memberID: "ZNTH-" + Math.floor(Math.random() * 90000 + 10000),
            createdAt: new Date()
        });

        alert("Berhasil Daftar!");
        window.location.href = "profile.html";
    } catch (error) {
        alert("Gagal Daftar: " + error.message);
    }
};

// --- FUNGSI RESET PASSWORD ---
window.handleResetPassword = async () => {
    const email = document.getElementById('resetEmail').value;
    if (!email) return alert("Masukan email!");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link reset sudah dikirim ke email!");
        location.reload();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// --- FUNGSI LOGOUT ---
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};

// --- CEK STATUS LOGIN ---
onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    if (user) {
        if (path.includes("profile.html")) {
            const docRef = doc(db, "members", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                document.getElementById('userNameDisplay').innerText = data.name;
                document.getElementById('memberIDDisplay').innerText = data.memberID;
                document.getElementById('userRoleDisplay').innerText = data.role;
            }
        }
        if (path.includes("login.html")) window.location.href = "profile.html";
    } else {
        if (path.includes("profile.html")) window.location.href = "login.html";
    }
});
