import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
}

export const animalsApi = {
  getAll: (params?: any) => api.get('/animals', { params }),
  getFeed: () => api.get('/animals/feed'),
  getOne: (id: number) => api.get(`/animals/${id}`),
  create: (data: any) => api.post('/animals', data),
  update: (id: number, data: any) => api.put(`/animals/${id}`, data),
  delete: (id: number) => api.delete(`/animals/${id}`),
  uploadPhoto: (animalId: number, file: File, isPrimary: boolean = false) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/upload/animal/${animalId}/photo?is_primary=${isPrimary}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const swipesApi = {
  create: (animalId: number, direction: string) =>
    api.post('/swipes', { animal_id: animalId, direction }),
  getMatches: () => api.get('/swipes/matches'),
  getHistory: () => api.get('/swipes/history'),
}

export const sheltersApi = {
  getAll: (params?: any) => api.get('/shelters', { params }),
  getOne: (id: number) => api.get(`/shelters/${id}`),
  createRequest: (data: any) => api.post('/shelters/requests', data),
  getMyRequests: () => api.get('/shelters/requests/my'),
}

export const donationsApi = {
  create: (data: any) => api.post('/donations', data),
  getMy: () => api.get('/donations/my'),
  getByAnimal: (animalId: number) => api.get(`/donations/animal/${animalId}`),
}

export const faqsApi = {
  getAll: (params?: any) => api.get('/faqs', { params }),
  search: (q: string) => api.get('/faqs/search', { params: { q } }),
  getCategories: () => api.get('/faqs/categories'),
  markHelpful: (id: number) => api.post(`/faqs/${id}/helpful`),
}