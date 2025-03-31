document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const rememberMe = document.getElementById('remember');
    const loginBtn = document.querySelector('.login-btn');
    const googleLoginBtn = document.getElementById('google-login');
    const githubLoginBtn = document.getElementById('github-login');

    // Check for remembered credentials
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMe.checked = true;
    }

    // Check for token in URL (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        // Store token and redirect to home
        localStorage.setItem('token', token);
        window.location.href = '/';
        return;
    }

    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        window.location.href = '/';
        return;
    }

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
        togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Input validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.style.display = 'none';
    }

    emailInput.addEventListener('input', () => {
        if (!validateEmail(emailInput.value)) {
            showError(emailError, 'Please enter a valid email address');
        } else {
            hideError(emailError);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (!validatePassword(passwordInput.value)) {
            showError(passwordError, 'Password must be at least 6 characters long');
        } else {
            hideError(passwordError);
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate inputs
        if (!validateEmail(email)) {
            showError(emailError, 'Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            showError(passwordError, 'Password must be at least 6 characters long');
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Handle remember me
            if (rememberMe.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Show success message
            const toast = document.createElement('div');
            toast.className = 'toast success';
            toast.textContent = 'Login successful! Redirecting...';
            document.body.appendChild(toast);

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);

        } catch (error) {
            // Show error message
            const errorMessage = error.message === 'Failed to fetch' 
                ? 'Unable to connect to server. Please check your internet connection.'
                : error.message;
            
            showError(passwordError, errorMessage);
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });

    // Handle Google login
    googleLoginBtn.addEventListener('click', () => {
        window.location.href = '/api/auth/google';
    });

    // Handle GitHub login
    githubLoginBtn.addEventListener('click', () => {
        showToast('GitHub login coming soon!', 'info');
    });

    // Toast notification helper
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}); 