/**
 * Tab-Isolated & Role-Aware Authentication Storage Engine
 *
 * Enables simultaneous login of multiple accounts (e.g. DEALER, BUYER 1, BUYER 2)
 * in the same browser across different tabs without cross-tab session conflicts,
 * clobbering, or unexpected lockouts.
 *
 * Architecture:
 * 1. sessionStorage (Tab-Isolated - Supreme Truth):
 *    Native browser sessionStorage is private per tab. Tab 1 (Buyer Priya), Tab 2 (Buyer Rahul),
 *    and Tab 3 (Dealer Sahyadri Motors) each maintain their own active token and user object.
 *    If a tab has a session in sessionStorage, that tab's session is ALWAYS respected.
 *
 * 2. Role-Scoped localStorage (Persistent per-role vault):
 *    - motorcircle_buyer_token / motorcircle_buyer_user
 *    - motorcircle_dealer_token / motorcircle_dealer_user
 *    - motorcircle_admin_token / motorcircle_admin_user
 *    Stores credentials per role so that Dealer credentials NEVER overwrite Buyer credentials,
 *    and vice versa.
 *
 * 3. Route-Aware Hydration for Direct Bookmark Links:
 *    When a fresh tab opens directly to a protected portal route (/dealer/* or /buyer/*),
 *    if sessionStorage is empty, it hydrates from that specific role's vault.
 *    Crucially, public routes (/, /login, /register, /cars) start completely clean (GUEST)
 *    so new tabs are never auto-clobbered by credentials from another tab.
 */

export const GUEST_USER = {
  id: 'guest',
  name: 'Guest',
  role: 'PUBLIC',
  email: '',
  phone: '',
  city: '',
};

/**
 * Detects whether the current browser window/tab is on a role-specific portal
 * @returns {'DEALER' | 'BUYER' | 'ADMIN' | null}
 */
export function getRouteRoleHint() {
  if (typeof window === 'undefined') return null;
  const path = (window.location.pathname || '').toLowerCase();
  if (path.startsWith('/dealer')) return 'DEALER';
  if (path.startsWith('/buyer')) return 'BUYER';
  if (path.startsWith('/admin')) return 'ADMIN';
  return null;
}

/**
 * Retrieves the active JWT token for the current tab.
 * Tab-isolated sessionStorage is ALWAYS preferred.
 */
export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Tab-isolated sessionStorage is the supreme authority for this tab
    const sessionToken = sessionStorage.getItem('motorcircle_auth_token');
    if (sessionToken) {
      return sessionToken;
    }

    // 2. Only hydrate if directly navigating to a role-protected route with an empty tab session
    const roleHint = getRouteRoleHint();
    if (roleHint) {
      const roleKey = `motorcircle_${roleHint.toLowerCase()}_token`;
      const roleToken = localStorage.getItem(roleKey);
      if (roleToken) {
        // Hydrate this fresh tab with the matching role vault
        sessionStorage.setItem('motorcircle_auth_token', roleToken);
        const roleUserRaw = localStorage.getItem(`motorcircle_${roleHint.toLowerCase()}_user`);
        if (roleUserRaw) {
          sessionStorage.setItem('motorcircle_user', roleUserRaw);
        }
        return roleToken;
      }
    }

    // 3. For public/marketing/login routes with empty sessionStorage, return null (clean tab!)
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Retrieves the active User profile object for the current tab.
 */
export function getStoredUser() {
  if (typeof window === 'undefined') return GUEST_USER;
  try {
    // 1. Tab-isolated sessionStorage
    const sessionUserRaw = sessionStorage.getItem('motorcircle_user');
    if (sessionUserRaw) {
      try {
        const parsed = JSON.parse(sessionUserRaw);
        if (parsed && parsed.role && parsed.role !== 'PUBLIC') {
          return parsed;
        }
      } catch (e) {}
    }

    // 2. Only hydrate if directly navigating to a role-protected route
    const roleHint = getRouteRoleHint();
    if (roleHint) {
      const roleUserRaw = localStorage.getItem(`motorcircle_${roleHint.toLowerCase()}_user`);
      if (roleUserRaw) {
        try {
          const user = JSON.parse(roleUserRaw);
          sessionStorage.setItem('motorcircle_user', roleUserRaw);
          const roleToken = localStorage.getItem(`motorcircle_${roleHint.toLowerCase()}_token`);
          if (roleToken) {
            sessionStorage.setItem('motorcircle_auth_token', roleToken);
          }
          return user;
        } catch (e) {}
      }
    }

    // 3. Public routes or empty state start as Guest
    return GUEST_USER;
  } catch (e) {
    return GUEST_USER;
  }
}

/**
 * Persists an authenticated session:
 * 1. Current tab's sessionStorage (isolated to this tab only)
 * 2. Role-scoped localStorage (e.g. motorcircle_dealer_token) so it doesn't overwrite other roles
 */
export function saveAuthSession(token, user) {
  if (typeof window === 'undefined' || !token || !user) return;
  try {
    const role = (user.role || 'BUYER').toUpperCase();
    const roleLower = role.toLowerCase();
    const userJson = JSON.stringify(user);

    // 1. Tab-isolated session (private to this browser tab)
    sessionStorage.setItem('motorcircle_auth_token', token);
    sessionStorage.setItem('motorcircle_user', userJson);

    // 2. Role-scoped persistent vault (NEVER overwrites other roles)
    localStorage.setItem(`motorcircle_${roleLower}_token`, token);
    localStorage.setItem(`motorcircle_${roleLower}_user`, userJson);

    // 3. User phone-scoped vault (allows multiple buyer profiles to be remembered)
    if (user.phone) {
      const phoneDigits = String(user.phone).replace(/\D/g, '').slice(-10);
      if (phoneDigits) {
        localStorage.setItem(`motorcircle_user_${phoneDigits}`, userJson);
      }
    }
  } catch (e) {
    console.error('Failed to save auth session:', e);
  }
}

/**
 * Clears an authenticated session.
 * By default, only clears the current tab's sessionStorage so other tabs are NOT logged out.
 * If role is explicitly provided, also removes that role's persistent vault from localStorage.
 */
export function clearAuthSession(role = null) {
  if (typeof window === 'undefined') return;
  try {
    // 1. Always clear this tab's sessionStorage
    sessionStorage.removeItem('motorcircle_auth_token');
    sessionStorage.removeItem('motorcircle_user');

    // 2. Only clear persistent role vault if explicitly asked
    if (role) {
      const roleLower = role.toLowerCase();
      localStorage.removeItem(`motorcircle_${roleLower}_token`);
      localStorage.removeItem(`motorcircle_${roleLower}_user`);
    }
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

/**
 * Retrieves a stored session for a specific role without modifying the current tab
 */
export function getRoleSession(role) {
  if (typeof window === 'undefined' || !role) return null;
  try {
    const roleLower = role.toLowerCase();
    const token = localStorage.getItem(`motorcircle_${roleLower}_token`);
    const userRaw = localStorage.getItem(`motorcircle_${roleLower}_user`);
    if (token && userRaw) {
      return { token, user: JSON.parse(userRaw) };
    }
    return null;
  } catch (e) {
    return null;
  }
}
