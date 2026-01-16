// 1. IMPORT FIREBASE SDK
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

// 2. KONFIGURASI FIREBASE (Ganti dengan milikmu!)
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "zenith-asset.firebaseapp.com",
    projectId: "zenith-asset",
    storageBucket: "zenith-asset.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:1234567:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- FUNGSI REGISTRASI ---
window.handleRegister = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if (!name || !email || !pass) return alert("Mohon lengkapi semua kolom!");
    if (pass.length < 6) return alert("Password minimal 6 karakter!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Simpan data tambahan ke Firestore
        await setDoc(doc(db, "members", user.uid), {
            name: name,
            email: email,
            role: "NEWBIE", // Default role
            memberID: "ZNTH-" + Math.floor(Math.random() * 90000 + 10000),
            createdAt: new Date()
        });

        alert("Registrasi Berhasil!");
        window.location.href = "profile.html";
    } catch (error) {
        alert("Gagal Daftar: " + error.message);
    }
};

// --- FUNGSI LOGIN ---
window.handleLogin = async () => {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;

    if (!email || !pass) return alert("Masukkan email dan password!");

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "profile.html";
    } catch (error) {
        alert("Login Gagal: Periksa kembali email/password Anda.");
    }
};

// --- FUNGSI LUPA PASSWORD ---
window.handleResetPassword = async () => {
    const email = document.getElementById('resetEmail').value;
    if (!email) return alert("Masukkan email Anda!");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link reset password telah dikirim ke email! Cek inbox/spam.");
        location.reload();
    } catch (error) {
        alert("Gagal: " + error.message);
    }
};

// --- FUNGSI LOGOUT ---
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};

// --- MONITORING STATUS USER & DISPLAY DATA ---
onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;

    if (user) {
        // Jika user di halaman profile, ambil data dari Firestore
        if (path.includes("profile.html")) {
            const docRef = doc(db, "members", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                document.getElementById('userNameDisplay').innerText = data.name;
                document.getElementById('memberIDDisplay').innerText = data.memberID;
                document.getElementById('userRoleDisplay').innerText = data.role;
                // Untuk menu settings
                if(document.getElementById('myAccountID')) {
                    document.getElementById('myAccountID').value = data.memberID;
                }
            }
        }
        // Jika user sudah login tapi di halaman login.html, lempar ke profile
        if (path.includes("login.html")) {
            window.location.href = "profile.html";
        }
    } else {
        // Jika user BELUM login dan mencoba buka profile, lempar ke login
        if (path.includes("profile.html")) {
            window.location.href = "login.html";
        }
    }
});
