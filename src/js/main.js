document.addEventListener("DOMContentLoaded", function() {
    const formPopup = document.getElementById('form-popup');
    const openBtn = document.getElementById('open-popup');
    const closeBtn = document.getElementById('close-popup');

    const form = document.getElementById('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const heading = document.querySelector('.popup__heading');
    const submitBtn = form.querySelector('button[type="submit"]');

    const API_URL = 'https://api.dating.com/identity';
    const REDIRECT_URL = 'https://www.dating.com/people/#token=';

    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        window.location.href = REDIRECT_URL + savedToken;
        return;
    }

    openBtn.addEventListener('click', () => formPopup.showModal());
    closeBtn.addEventListener('click', () => formPopup.close());
    document.addEventListener('keydown', (e) => { if (e.key === "Escape" && formPopup.open) formPopup.close(); });
    formPopup.addEventListener('click', (e) => { if (e.target === formPopup) formPopup.close(); });

    const emailRe = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    function getLabel(input) { return input.closest('label'); }

    function clearError(input) {
        const label = getLabel(input);
        if (!label) return;
        label.classList.remove('error');
        const msg = label.querySelector('.error-text');
        if (msg) msg.remove();
    }

    function showError(input, message) {
        const label = getLabel(input);
        if (!label) return;
        label.classList.add('error');
        let msg = label.querySelector('.error-text');
        if (!msg) {
            msg = document.createElement('p');
            msg.className = 'error-text';
            label.appendChild(msg);
        }
        msg.textContent = message;
    }

    function validate() {
        let valid = true;

        clearError(emailInput);
        clearError(passwordInput);

        const email = (emailInput.value || '').trim();
        const password = passwordInput.value || '';

        if (!emailRe.test(email)) {
            showError(emailInput, 'Please enter a valid e-mail');
            valid = false;
        }
        if (password.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            valid = false;
        }
        return valid;
    }

    emailInput.addEventListener('focus', () => clearError(emailInput));
    passwordInput.addEventListener('focus', () => clearError(passwordInput));
    emailInput.addEventListener('click', () => clearError(emailInput));
    passwordInput.addEventListener('click', () => clearError(passwordInput));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        submitBtn.disabled = true;

        try {
            const basicAuth = btoa(`${email}:${password}`);
            let res = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + basicAuth,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                res = await fetch(API_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
            }

            const data = await res.json().catch(() => null);
            const token = res.headers.get('X-Token');

            if (res.ok && token) {
                localStorage.setItem('authToken', token);
                window.location.href = REDIRECT_URL + token;
            } else if (res.ok) {
                form.remove();
                const thankYou = document.createElement('p');
                thankYou.className = 'h1 gradient-text popup__success';
                thankYou.textContent = 'Thank you';
                heading.before(thankYou);
                heading.textContent = 'To complete registration, please check your e-mail';
            } else {
                const msg =
                    (data && (data.message || data.error || data.detail)) ||
                    `Request failed with status ${res.status}. Please try again.`;
                alert(msg);
            }
        } catch {
            alert('Network error. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
        }
    });
});
