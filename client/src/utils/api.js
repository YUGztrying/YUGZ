import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Check if backend is available
let backendAvailable = false

export const checkBackend = async () => {
  try {
    await axios.get(`${API_URL}/health`, { timeout: 2000 })
    backendAvailable = true
    return true
  } catch (error) {
    backendAvailable = false
    return false
  }
}

// Initialize backend check
checkBackend()

// Pages API
export const pagesAPI = {
  async getAll() {
    if (backendAvailable) {
      try {
        const response = await axios.get(`${API_URL}/pages`)
        return response.data
      } catch (error) {
        console.warn('Backend unavailable, using localStorage')
        backendAvailable = false
      }
    }

    // Fallback to localStorage
    const pages = localStorage.getItem('notion-pages')
    return pages ? JSON.parse(pages) : []
  },

  async getOne(id) {
    if (backendAvailable) {
      try {
        const response = await axios.get(`${API_URL}/pages/${id}`)
        return response.data
      } catch (error) {
        console.warn('Backend unavailable, using localStorage')
        backendAvailable = false
      }
    }

    // Fallback to localStorage
    const pages = localStorage.getItem('notion-pages')
    const parsedPages = pages ? JSON.parse(pages) : []
    return parsedPages.find(p => p.id === id || p._id === id)
  },

  async create(pageData) {
    if (backendAvailable) {
      try {
        const response = await axios.post(`${API_URL}/pages`, pageData)
        return response.data
      } catch (error) {
        console.warn('Backend unavailable, using localStorage')
        backendAvailable = false
      }
    }

    // Fallback to localStorage
    const newPage = {
      id: Date.now().toString(),
      ...pageData,
      createdAt: new Date().toISOString()
    }
    const pages = localStorage.getItem('notion-pages')
    const parsedPages = pages ? JSON.parse(pages) : []
    parsedPages.push(newPage)
    localStorage.setItem('notion-pages', JSON.stringify(parsedPages))
    return newPage
  },

  async update(id, pageData) {
    if (backendAvailable) {
      try {
        const response = await axios.put(`${API_URL}/pages/${id}`, pageData)
        return response.data
      } catch (error) {
        console.warn('Backend unavailable, using localStorage')
        backendAvailable = false
      }
    }

    // Fallback to localStorage
    const pages = localStorage.getItem('notion-pages')
    const parsedPages = pages ? JSON.parse(pages) : []
    const updatedPages = parsedPages.map(p =>
      (p.id === id || p._id === id) ? { ...p, ...pageData, id: id } : p
    )
    localStorage.setItem('notion-pages', JSON.stringify(updatedPages))
    return updatedPages.find(p => p.id === id || p._id === id)
  },

  async delete(id) {
    if (backendAvailable) {
      try {
        await axios.delete(`${API_URL}/pages/${id}`)
        return { success: true }
      } catch (error) {
        console.warn('Backend unavailable, using localStorage')
        backendAvailable = false
      }
    }

    // Fallback to localStorage
    const pages = localStorage.getItem('notion-pages')
    const parsedPages = pages ? JSON.parse(pages) : []
    const filteredPages = parsedPages.filter(p => p.id !== id && p._id !== id)
    localStorage.setItem('notion-pages', JSON.stringify(filteredPages))
    return { success: true }
  }
}
