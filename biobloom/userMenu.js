document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const userNameSpan = document.querySelector('.user-name');
    const logoutBtn = document.querySelector('.logout-btn');

    // Check for token in URL (for Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // Store the token
        localStorage.setItem('token', token);
        
        // Fetch user data
        fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            updateUI(user);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if user is logged in
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            updateUI(user);
        } else {
            // Show login/register buttons
            authButtons.classList.remove('hidden');
            userMenu.style.display = 'none';
        }
    }

    // Update UI based on user data
    function updateUI(user) {
        // Hide auth buttons
        authButtons.classList.add('hidden');
        
        // Show user menu
        userMenu.style.display = 'block';
        userNameSpan.textContent = user.name;
    }

    // Handle logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = 'Logged out successfully!';
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);

        // Redirect to home page
        window.location.href = '/';
    });

    // Check login status when page loads
    checkLoginStatus();
}); 