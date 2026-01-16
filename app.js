// 1. IMPORT FIREBASE SDK (CDN VERSION)
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

// 2. KONFIGURASI FIREBASE
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

// --- A. FUNGSI LOGIN ---
window.handleLogin = async () => {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    if (!email || !pass) return alert("Masukkan email dan password!");

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "profile.html";
    } catch (error) {
        alert("Login Gagal: Email atau Password salah.");
    }
};

// --- B. FUNGSI DAFTAR ---
window.handleRegister = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if (!name || !email || !pass) return alert("Mohon lengkapi data!");
    if (pass.length < 6) return alert("Password minimal 6 karakter!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Simpan data ke Firestore (Database)
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

// --- C. FUNGSI RESET PASSWORD (FIXED) ---
window.handleResetPassword = async () => {
    const email = document.getElementById('resetEmail').value;
    if (!email) return alert("Masukkan email terdaftar!");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link reset password telah dikirim ke email! Cek Inbox atau folder SPAM.");
        window.location.reload(); 
    } catch (error) {
        if(error.code === "auth/user-not-found") {
            alert("Email tidak ditemukan!");
        } else {
            alert("Error: " + error.message);
        }
    }
};

// --- D. FUNGSI LOGOUT ---
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};

// --- E. MONITOR STATUS LOGIN ---
onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    if (user) {
        // Tampilkan data jika di halaman profile
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
        // Redirect jika sudah login tapi akses login.html
        if (path.includes("login.html")) window.location.href = "profile.html";
    } else {
        // Redirect jika belum login tapi akses profile.html
        if (path.includes("profile.html")) window.location.href = "login.html";
    }
});
