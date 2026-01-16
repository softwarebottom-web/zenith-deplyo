import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// KONFIGURASI FIREBASE (GANTI DENGAN PUNYAMU)
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "zenith-asset.firebaseapp.com",
    projectId: "zenith-asset",
    storageBucket: "zenith-asset.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:1234567:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. FUNGSI LOGIN
window.handleLogin = async () => {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    if(!email || !pass) return alert("Isi email dan password!");

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "profile.html";
    } catch (error) {
        alert("Login Gagal: " + error.message);
    }
};

// 2. FUNGSI DAFTAR (FIX)
window.handleRegister = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if(!name || !email || !pass) return alert("Lengkapi semua data!");
    if(pass.length < 6) return alert("Password minimal 6 karakter!");

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        await setDoc(doc(db, "members", user.uid), {
            name: name,
            email: email,
            role: "NEWBIE",
            memberID: "ZNTH-" + Math.floor(10000 + Math.random() * 90000),
            createdAt: new Date()
        });

        alert("Berhasil Daftar!");
        window.location.href = "profile.html";
    } catch (error) {
        alert("Gagal Daftar: " + error.message);
    }
};

// 3. FUNGSI RESET PASSWORD (FIX)
window.handleResetPassword = async () => {
    const email = document.getElementById('resetEmail').value;
    if(!email) return alert("Masukkan email terdaftar!");

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link reset password telah dikirim ke email Anda!");
        location.reload(); 
    } catch (error) {
        alert("Error: " + error.message);
    }
};
