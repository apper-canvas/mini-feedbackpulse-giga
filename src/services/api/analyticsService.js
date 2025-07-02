import { delay } from '@/utils/helpers'
import { feedbackService } from './feedbackService'

class AnalyticsService {
  async getDetailedAnalytics(timeRange = '7d') {
    await delay(400)
    
    const feedback = await feedbackService.getAll()
    const now = new Date()
    let startDate
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const filteredFeedback = feedback.filter(f => 
      new Date(f.timestamp) >= startDate
    )

    const totalResponses = filteredFeedback.length
    const avgRating = totalResponses > 0 
      ? filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / totalResponses 
      : 0

    // Rating distribution
    const ratingDistribution = filteredFeedback.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1
      return acc
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    // Sentiment analysis (simplified)
    const sentiment = {
      positive: filteredFeedback.filter(f => f.rating >= 4).length,
      neutral: filteredFeedback.filter(f => f.rating === 3).length,
      negative: filteredFeedback.filter(f => f.rating <= 2).length
    }

    // Timeline data
    const timeline = this.generateTimeline(filteredFeedback, timeRange)

    // Top pages
    const pageStats = filteredFeedback.reduce((acc, f) => {
      if (!acc[f.pageUrl]) {
        acc[f.pageUrl] = { responses: 0, totalRating: 0 }
      }
      acc[f.pageUrl].responses++
      acc[f.pageUrl].totalRating += f.rating
      return acc
    }, {})

    const topPages = Object.entries(pageStats)
      .map(([url, stats]) => ({
        url,
        responses: stats.responses,
        avgRating: stats.totalRating / stats.responses
      }))
      .sort((a, b) => b.responses - a.responses)
      .slice(0, 5)

    // Calculate insights
    const positivePercentage = totalResponses > 0 
      ? Math.round((sentiment.positive / totalResponses) * 100) 
      : 0

    return {
      totalResponses,
      avgRating,
      responseRate: '24.8%', // Mock data
      nps: Math.round((sentiment.positive - sentiment.negative) / totalResponses * 100) || 0,
      ratingDistribution,
      sentiment,
      timeline,
      topPages,
      insights: {
        positivePercentage,
        avgResponseTime: '15',
        peakHour: '14:00'
      }
    }
  }

  generateTimeline(feedback, timeRange) {
    const labels = []
    const responses = []
    const ratings = []
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayFeedback = feedback.filter(f => {
        const fDate = new Date(f.timestamp)
        return fDate.toDateString() === date.toDateString()
      })
      
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      responses.push(dayFeedback.length)
      
      const avgRating = dayFeedback.length > 0 
        ? dayFeedback.reduce((sum, f) => sum + f.rating, 0) / dayFeedback.length 
        : 0
      ratings.push(Math.round(avgRating * 10) / 10)
    }
    
    return { labels, responses, ratings }
  }
}

export const analyticsService = new AnalyticsService()