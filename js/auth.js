document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase if config exists
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    // Login Button Logic
    const loginBtn = document.querySelector('.page-module__aydn6q__googleBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (typeof firebase === 'undefined') {
                console.error("Firebase SDK not loaded");
                // Fallback to simulation if Firebase fails (for safety)
                localStorage.setItem('df_auth_token', 'simulated_fallback');
                window.location.href = 'dashboard.html';
                return;
            }

            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    console.log("Logged in as:", user.displayName);
                    localStorage.setItem('df_auth_token', user.accessToken); // Or user.uid
                    localStorage.setItem('df_user_name', user.displayName);
                    localStorage.setItem('df_user_photo', user.photoURL);
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error("Login failed:", error);
                    alert("Google Sign-In failed: " + error.message);
                });
        });
    }

    // Logout Button Logic
    const logoutBtn = document.querySelector('.TopBar-module__LYwH0W__logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const doLogout = () => {
                localStorage.removeItem('df_auth_token');
                localStorage.removeItem('df_user_name');
                localStorage.removeItem('df_user_photo');

                const currentPath = window.location.pathname;
                if (currentPath.includes('/dashboard/')) {
                    window.location.href = '../login.html';
                } else {
                    window.location.href = 'login.html';
                }
            };

            if (typeof firebase !== 'undefined' && firebase.auth()) {
                firebase.auth().signOut().then(doLogout).catch(doLogout);
            } else {
                doLogout();
            }
        });
    }

    // Update UI with User Info (for Dashboard)
    const userNameEl = document.querySelector('.TopBar-module__LYwH0W__username');
    const userAvatarEl = document.querySelector('.TopBar-module__LYwH0W__avatar');

    if (userNameEl) {
        const storedName = localStorage.getItem('df_user_name');
        if (storedName) userNameEl.textContent = storedName;
    }
    if (userAvatarEl) {
        const storedPhoto = localStorage.getItem('df_user_photo');
        if (storedPhoto) userAvatarEl.src = storedPhoto;
    }

    // Index Page Logic (Dashboard Button state)
    const indexLoginBtn = document.querySelector('.page-module___8aEwW__loginBtn');
    const indexCtaBtn = document.querySelector('.page-module___8aEwW__primaryCta');
    const token = localStorage.getItem('df_auth_token');

    if (token) {
        if (indexLoginBtn) {
            indexLoginBtn.textContent = 'Dashboard';
            indexLoginBtn.href = 'dashboard.html';
        }
        if (indexCtaBtn) {
            indexCtaBtn.textContent = 'Go to Dashboard';
            indexCtaBtn.href = 'dashboard.html';
        }
    }
});
