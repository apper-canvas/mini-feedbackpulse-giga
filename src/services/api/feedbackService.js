import { delay } from '@/utils/helpers'

class FeedbackService {
  constructor() {
    this.storageKey = 'feedbackpulse_feedback'
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const mockData = [
        {
          Id: 1,
          rating: 5,
          comment: "Absolutely love this product! The user interface is intuitive and the features are exactly what I needed.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          email: "john.doe@email.com",
          pageUrl: "/product/dashboard",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        {
          Id: 2,
          rating: 4,
          comment: "Great experience overall. The only issue I had was with the loading times, but everything else works perfectly.",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          email: "sarah.wilson@company.com",
          pageUrl: "/features",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        },
        {
          Id: 3,
          rating: 3,
          comment: "It's okay, but I think there's room for improvement in the mobile experience.",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          email: null,
          pageUrl: "/pricing",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
        },
        {
          Id: 4,
          rating: 5,
          comment: "Excellent customer service and the product exceeded my expectations. Highly recommended!",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          email: "mike.johnson@startup.io",
          pageUrl: "/contact",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        {
          Id: 5,
          rating: 2,
          comment: "Had some technical difficulties during setup. The documentation could be clearer.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          email: "support@techcorp.com",
          pageUrl: "/docs/getting-started",
          userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        },
        {
          Id: 6,
          rating: 4,
          comment: "Really impressed with the analytics dashboard. The insights are very helpful for my business.",
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          email: "analytics.user@business.com",
          pageUrl: "/analytics",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      ]
      localStorage.setItem(this.storageKey, JSON.stringify(mockData))
    }
  }

  async getAll() {
    await delay(300)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    return [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await delay(200)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    const item = data.find(f => f.Id === id)
    if (!item) {
      throw new Error('Feedback not found')
    }
    return { ...item }
  }

  async create(feedback) {
    await delay(250)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    const maxId = data.length > 0 ? Math.max(...data.map(f => f.Id)) : 0
    
    const newFeedback = {
      Id: maxId + 1,
      ...feedback,
      timestamp: new Date().toISOString()
    }
    
    data.push(newFeedback)
    localStorage.setItem(this.storageKey, JSON.stringify(data))
    return { ...newFeedback }
  }

  async update(id, updates) {
    await delay(250)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    const index = data.findIndex(f => f.Id === id)
    
    if (index === -1) {
      throw new Error('Feedback not found')
    }
    
    data[index] = { ...data[index], ...updates }
    localStorage.setItem(this.storageKey, JSON.stringify(data))
    return { ...data[index] }
  }

  async delete(id) {
    await delay(200)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    const filteredData = data.filter(f => f.Id !== id)
    
    if (filteredData.length === data.length) {
      throw new Error('Feedback not found')
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredData))
    return true
  }

  async getAnalytics() {
    await delay(300)
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
    
    const totalResponses = data.length
    const avgRating = totalResponses > 0 
      ? data.reduce((sum, f) => sum + f.rating, 0) / totalResponses 
      : 0
    
    const ratingDistribution = data.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1
      return acc
    }, {})
    
    return {
      totalResponses,
      avgRating,
      ratingDistribution,
      recentFeedback: data.slice(0, 5)
    }
  }
}

export const feedbackService = new FeedbackService()