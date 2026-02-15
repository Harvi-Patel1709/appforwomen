/**
 * Eraya - Auth helper: current user, login redirect, logout.
 * Include on pages that need login state or API calls with credentials.
 */
(function() {
    'use strict';
    var currentUser = null;

    function fetchOptions(method, body) {
        var opts = { method: method || 'GET', credentials: 'include' };
        if (body) {
            opts.headers = { 'Content-Type': 'application/json' };
            opts.body = JSON.stringify(body);
        }
        return opts;
    }

    function getCurrentUser() {
        return fetch('/api/me', fetchOptions()).then(function(r) { return r.json(); }).then(function(data) {
            currentUser = data.user || null;
            return currentUser;
        });
    }

    function requireLogin(onLoggedIn) {
        getCurrentUser().then(function(user) {
            if (user) {
                if (onLoggedIn) onLoggedIn(user);
            } else {
                if (confirm('You need to sign in to use this feature. Go to login page?')) {
                    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.href);
                }
            }
        });
    }

    function renderAuthStatus(containerId) {
        var container = document.getElementById(containerId || 'auth-status');
        if (!container) return;
        getCurrentUser().then(function(user) {
            if (user) {
                container.innerHTML = '<span style="color:var(--white);">' + (user.name || user.email) + '</span> ' +
                    '<a href="#" id="auth-logout" style="color:var(--white); margin-left:8px;">Logout</a>';
                var logout = document.getElementById('auth-logout');
                if (logout) {
                    logout.addEventListener('click', function(e) {
                        e.preventDefault();
                        fetch('/api/logout', { method: 'POST', credentials: 'include' }).then(function() {
                            window.location.reload();
                        });
                    });
                }
            } else {
                container.innerHTML = '<a href="login.html" style="color:var(--white);">Login</a>';
            }
        });
    }

    window.ErayaAuth = {
        getCurrentUser: getCurrentUser,
        requireLogin: requireLogin,
        renderAuthStatus: renderAuthStatus,
        fetchWithAuth: function(url, opts) {
            opts = opts || {};
            opts.credentials = 'include';
            if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
                opts.headers = opts.headers || {};
                opts.headers['Content-Type'] = 'application/json';
                opts.body = JSON.stringify(opts.body);
            }
            return fetch(url, opts);
        }
    };
})();
