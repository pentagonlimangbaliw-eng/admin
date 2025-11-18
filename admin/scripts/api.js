// === CONFIG ===
const BASE_URL = 'https://dreamspace-backend.onrender.com';
 
// === SHARED FETCH WRAPPER ===
const apiFetch = async (path, opts = {}) => {
  const headers = opts.headers || {};
  const token = localStorage.getItem('ds_token');

  if (token) headers['Authorization'] = 'Bearer ' + token;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  const res = await fetch(BASE_URL + path, { ...opts, headers });

  if (res.status === 401) throw new Error('401 Unauthorized');

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || JSON.stringify(json));
    return json;
  } else {
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return res.text(); // or Blob, depending on your need
  }
};

// === API OBJECT ===
const api = {
  auth: {
    register: (payload) => apiFetch('/api/auth/register', {
      method: 'POST', body: JSON.stringify(payload)
    }),
    login: (payload) => apiFetch('/api/auth/login', {
      method: 'POST', body: JSON.stringify(payload)
    }),
    me: () => apiFetch('/api/auth/me')
  },

  catalog: {
    getRooms: ({ page = 1, limit = 20, search = '' } = {}) =>
      apiFetch(`/api/catalog/rooms?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

    getRoom: (id) => apiFetch(`/api/catalog/rooms/${id}`),
    addRoom: (payload) => apiFetch('/api/catalog/rooms', {
      method: 'POST', body: JSON.stringify(payload)
    }),
    updateRoom: (id, payload) => apiFetch(`/api/catalog/rooms/${id}`, {
      method: 'PUT', body: JSON.stringify(payload)
    }),
    deleteRoom: (id) => apiFetch(`/api/catalog/rooms/${id}`, { method: 'DELETE' }),

    // ✅ FIXED getItems()
    getItems: async ({ page = 1, limit = 50, category = '', search = '' } = {}) => {
      let qs = `?page=${page}&limit=${limit}`;
      if (category) qs += `&category=${encodeURIComponent(category)}`;
      if (search) qs += `&search=${encodeURIComponent(search)}`;

      const res = await apiFetch(`/api/catalog/items${qs}`);

      // The backend returns { items, total, page, pages }
      // Make sure the frontend always receives the array directly
      return Array.isArray(res.items) ? res.items : res;
    },

    getItem: (id) => apiFetch(`/api/catalog/items/${id}`),
    addItem: (payload) => apiFetch('/api/catalog/items', {
      method: 'POST', body: JSON.stringify(payload)
    }),
    updateItem: (id, payload) => apiFetch(`/api/catalog/items/${id}`, {
      method: 'PUT', body: JSON.stringify(payload)
    }),
    deleteItem: (id) => apiFetch(`/api/catalog/items/${id}`, { method: 'DELETE' }),

    getAsset: (assetId) => apiFetch(`/api/assets/${assetId}`)
  },

  designs: {
    create: (payload) => apiFetch('/api/designs', {
      method: 'POST', body: JSON.stringify(payload)
    }),
    getByUser: (userId) => apiFetch(`/api/designs/user/${userId}`),

    getById: (id) => apiFetch(`/api/designs/${id}`),
    update: (id, payload) => apiFetch(`/api/designs/${id}`, {
      method: 'PUT', body: JSON.stringify(payload)
    }),
    delete: (id) => apiFetch(`/api/designs/${id}`, { method: 'DELETE' }),
    getRecent: () => apiFetch('/api/designs?recent=true')
  },

 // ✅ FIXED QUOTES SECTION
  quotes: {
    create: (payload) => apiFetch('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

    get: (filters = {}) => {
      const qs = [];
      if (filters.status) qs.push(`status=${encodeURIComponent(filters.status)}`);
      if (filters.from) qs.push(`from=${encodeURIComponent(filters.from)}`);
      if (filters.to) qs.push(`to=${encodeURIComponent(filters.to)}`);
      if (filters.userId) qs.push(`userId=${encodeURIComponent(filters.userId)}`);
      const q = qs.length ? '?' + qs.join('&') : '';
      return apiFetch(`/api/quotes${q}`);
    },

    getById: (id) => apiFetch(`/api/quotes/${id}`),

    update: (id, payload) => apiFetch(`/api/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

    delete: (id) => apiFetch(`/api/quotes/${id}`, { method: 'DELETE' }),

    exportCSV: (filters = {}) => {
      const qs = [];
      if (filters.status) qs.push(`status=${encodeURIComponent(filters.status)}`);
      if (filters.from) qs.push(`from=${encodeURIComponent(filters.from)}`);
      if (filters.to) qs.push(`to=${encodeURIComponent(filters.to)}`);
      const q = qs.length ? '?' + qs.join('&') : '';
      return apiFetch(`/api/quotes/export${q}`);
    }
  },

  sync: {
    rooms: (lastUpdated) => apiFetch(`/api/sync/rooms?lastUpdated=${encodeURIComponent(lastUpdated || '')}`),
    items: (lastUpdated) => apiFetch(`/api/sync/items?lastUpdated=${encodeURIComponent(lastUpdated || '')}`)
  },

  unity: {
    assetManifest: (roomId) => apiFetch(`/api/catalog/rooms/${roomId}/asset-manifest`),
    callbackDesignSaved: (payload) => apiFetch('/api/unity/callback/design-saved', {
      method: 'POST', body: JSON.stringify(payload)
    })
  },

  admin: {
    resetSession: () => apiFetch('/api/admin/kiosk/reset-session', {
      method: 'POST', body: JSON.stringify({})
    }),
    resetHard: () => apiFetch('/api/admin/kiosk/reset-hard', {
      method: 'POST', body: JSON.stringify({})
    })
  }
};

// === MAKE AVAILABLE TO GLOBAL SCOPE ===
window.api = api;
