document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const googleRegisterBtn = document.getElementById('google-register');
    const githubRegisterBtn = document.getElementById('github-register');
    const termsCheckbox = document.getElementById('terms');
    const fullnameError = document.getElementById('fullname-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        window.location.href = '/';
        return;
    }

    // Toggle password visibility
    function togglePasswordVisibility(inputElement, toggleButton) {
        const type = inputElement.type === 'password' ? 'text' : 'password';
        inputElement.type = type;
        toggleButton.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    }

    togglePassword.addEventListener('click', () => 
        togglePasswordVisibility(passwordInput, togglePassword));
    
    toggleConfirmPassword.addEventListener('click', () => 
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword));

    // Input validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // Password must be at least 8 characters long and contain at least one number and one letter
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    }

    function validateFullname(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]*$/.test(name);
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function hideError(element) {
        element.style.display = 'none';
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Real-time validation
    nameInput.addEventListener('input', () => {
        if (!validateFullname(nameInput.value)) {
            showError(fullnameError, 'Please enter a valid name (letters and spaces only)');
        } else {
            hideError(fullnameError);
        }
    });

    emailInput.addEventListener('input', () => {
        if (!validateEmail(emailInput.value)) {
            showError(emailError, 'Please enter a valid email address');
        } else {
            hideError(emailError);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (!validatePassword(passwordInput.value)) {
            showError(passwordError, 'Password must be at least 8 characters with letters and numbers');
        } else {
            hideError(passwordError);
        }
        
        // Check confirm password match
        if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match');
        } else {
            hideError(confirmPasswordError);
        }
    });

    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match');
        } else {
            hideError(confirmPasswordError);
        }
    });

    // Handle form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match');
            return;
        }

        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            showToast('Registration successful! Please login.', 'success');

            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Register';
        }
    });

    // Handle Google registration
    googleRegisterBtn.addEventListener('click', () => {
        window.location.href = '/api/auth/google';
    });

    // Handle GitHub registration
    githubRegisterBtn.addEventListener('click', () => {
        showToast('GitHub registration coming soon!', 'info');
    });

    // Check terms and conditions
    termsCheckbox.addEventListener('change', () => {
        if (!termsCheckbox.checked) {
            showError(confirmPasswordError, 'Please accept the Terms & Conditions');
        } else {
            hideError(confirmPasswordError);
        }
    });
}); 