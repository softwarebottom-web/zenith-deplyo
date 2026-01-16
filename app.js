import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    sendPasswordResetEmail, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBOBoKSfYRz_3z__n0CPGplfLh7I2Qku_I",
    authDomain: "academysawit.firebaseapp.com",
    projectId: "academysawit",
    storageBucket: "academysawit.firebasestorage.app",
    messagingSenderId: "144501931796",
    appId: "1:144501931796:web:33ed8b6131a21bf9dacc01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// AUTH FUNCTIONS
window.handleLogin = async () => {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "profile.html";
    } catch (e) { alert("Login Gagal!"); }
};

window.handleRegister = async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "members", res.user.uid), {
            name: name, email: email, role: "NEWBIE",
            memberID: "ZNTH-" + Math.floor(10000 + Math.random() * 90000)
        });
        window.location.href = "profile.html";
    } catch (e) { alert("Daftar Gagal!"); }
};

window.handleResetPassword = async () => {
    const email = document.getElementById('resetEmail').value;
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link reset dikirim ke email! Cek Inbox/Spam.");
        window.location.reload();
    } catch (e) { alert("Email tidak terdaftar!"); }
};

window.logout = () => signOut(auth).then(() => window.location.href = "login.html");

// MONITORING & DASHBOARD DATA
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "members", user.uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Update elemen dashboard jika ada
            if(document.getElementById('userName')) document.getElementById('userName').innerText = data.name;
            if(document.getElementById('memberID')) document.getElementById('memberID').innerText = data.memberID;
            if(document.getElementById('userRole')) document.getElementById('userRole').innerText = data.role;
            if(document.getElementById('accIDInput')) document.getElementById('accIDInput').value = data.memberID;
        }
    } else if (window.location.pathname.includes("profile.html")) {
        window.location.href = "login.html";
    }
});
