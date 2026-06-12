const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const api = {
  get: (path: string) => fetch(`${BASE_URL}${path}`),
};

export default api;
