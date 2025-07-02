import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SentimentBadge = ({ sentiment, confidence, className = '' }) => {
  if (!sentiment || sentiment === 'neutral') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ${className}`}
      >
        <ApperIcon name="Minus" size={12} className="mr-1" />
        Neutral ({confidence}%)
      </motion.div>
    )
  }

  const sentimentConfig = {
    positive: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: 'ThumbsUp',
      label: 'Positive'
    },
    negative: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: 'ThumbsDown',
      label: 'Negative'
    }
  }

  const config = sentimentConfig[sentiment] || sentimentConfig.neutral

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {config.label} ({confidence}%)
    </motion.div>
  )
}

export default SentimentBadge