const auth = {
  async login({ email, password }) {
    const data = await api.auth.login({ email, password });
    if (!data || !data.token) throw new Error('Invalid login response');

    localStorage.setItem('ds_token', data.token);

    // Optionally fetch profile immediately
    try {
      const profile = await api.auth.me();
      localStorage.setItem('ds_user', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not fetch profile after login', e);
    }

    return data;
  },

  logout() {
    localStorage.removeItem('ds_token');
    localStorage.removeItem('ds_user');
  },

  getToken() {
    return localStorage.getItem('ds_token');
  },

  getProfile() {
    const raw = localStorage.getItem('ds_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  getUserLabel() {
    const p = this.getProfile();
    if (!p) return '';
    return `${p.name || p.email || ''} (${p.role || ''})`;
  },

  async requireAuth() {
    const token = this.getToken();
    if (!token) throw new Error('401');

    // Try to refresh profile if missing
    if (!this.getProfile()) {
      const profile = await api.auth.me();
      localStorage.setItem('ds_user', JSON.stringify(profile));
    }

    return this.getProfile();
  },
};
