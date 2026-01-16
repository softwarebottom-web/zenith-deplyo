import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

window.logout = () => signOut(auth).then(() => window.location.href="login.html");

// FUNGSI UPLOAD (OWNER)
window.handleUpload = async () => {
    const title = document.getElementById('fileTitle').value;
    const type = document.getElementById('fileType').value;
    const file = document.getElementById('fileInput').files[0];
    const btn = document.getElementById('btnUpload');

    if(!file || !title) return alert("Isi judul dan pilih file!");
    btn.innerText = "Uploading..."; btn.disabled = true;

    try {
        const sRef = ref(storage, `content/${type}/${Date.now()}_${file.name}`);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        await setDoc(doc(db, "materials", Date.now().toString()), { title, type, url, createdAt: new Date() });
        alert("Berhasil!"); location.reload();
    } catch (e) { alert(e.message); btn.disabled = false; }
};

// MONITOR STATUS
onAuthStateChanged(auth, async (user) => {
    const authArea = document.getElementById('auth-nav-area');
    if (user) {
        const snap = await getDoc(doc(db, "members", user.uid));
        if (snap.exists()) {
            const data = snap.data();
            // Update Index Nav
            if (authArea) {
                authArea.innerHTML = `
                    <a href="course.html" style="color:var(--primary); margin-right:15px;">COURSE</a>
                    <a href="profile.html" class="btn-dashboard-nav">PROFILE</a>
                `;
            }
            // Update Dashboard
            if(document.getElementById('userNameDisplay')) document.getElementById('userNameDisplay').innerText = data.name;
            if(document.getElementById('userRoleDisplay')) document.getElementById('userRoleDisplay').innerText = data.role;
            if(data.role === "OWNER" && document.getElementById('adminPanel')) document.getElementById('adminPanel').style.display = "block";
        }
    }
});

// LOAD COURSE
if (window.location.pathname.includes("course.html")) {
    const list = document.getElementById('materiList');
    const querySnapshot = await getDocs(collection(db, "materials"));
    list.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        list.innerHTML += `
            <div class="material-item">
                ${item.type === 'video' ? `<video src="${item.url}" controls></video>` : `<div style="padding:40px; text-align:center; font-size:3rem;">📄</div>`}
                <div class="m-info">
                    <h4>${item.title}</h4>
                    ${item.type === 'ebook' ? `<a href="${item.url}" target="_blank" class="btn-auth" style="padding:5px; font-size:12px; text-decoration:none;">OPEN PDF</a>` : ''}
                </div>
            </div>`;
    });
}
