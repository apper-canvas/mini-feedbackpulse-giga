import Sentiment from 'sentiment'

class SentimentService {
  constructor() {
    this.sentiment = new Sentiment()
  }

  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return {
        type: 'neutral',
        score: 0,
        confidence: 0
      }
    }

    const result = this.sentiment.analyze(text)
    const normalizedScore = Math.max(-1, Math.min(1, result.score / Math.max(1, Math.abs(result.score))))
    
    let type = 'neutral'
    let confidence = Math.abs(normalizedScore) * 100

    if (result.score > 0) {
      type = 'positive'
    } else if (result.score < 0) {
      type = 'negative'
    }

    // Adjust confidence based on text length and word count
    const wordCount = text.split(/\s+/).length
    const lengthFactor = Math.min(1, wordCount / 10) // More words = higher confidence
    confidence = Math.round(confidence * lengthFactor)

    return {
      type,
      score: result.score,
      confidence: Math.max(10, confidence) // Minimum 10% confidence
    }
  }
}

export const sentimentService = new SentimentService()