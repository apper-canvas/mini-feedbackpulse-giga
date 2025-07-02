import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import StarRating from '@/components/atoms/StarRating'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import SentimentBadge from '@/components/molecules/SentimentBadge'
const FeedbackCard = ({ feedback, onDelete, onReply }) => {
  const { Id, rating, comment, timestamp, email, pageUrl, sentiment } = feedback
  return (
    <Card className="p-6" hover={true}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-primary-600" />
            </div>
          </div>
          <div>
            <StarRating rating={rating} size={16} />
            <p className="text-sm text-gray-500 mt-1">
              {email || 'Anonymous'} • {format(new Date(timestamp), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Reply"
            onClick={() => onReply(feedback)}
          >
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => onDelete(Id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

{comment && (
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-gray-700 leading-relaxed flex-1">{comment}</p>
            {sentiment && (
              <SentimentBadge 
                sentiment={sentiment.type} 
                confidence={sentiment.confidence}
                className="flex-shrink-0 mt-0.5"
              />
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <ApperIcon name="Globe" size={14} className="mr-1" />
            {pageUrl || 'Unknown page'}
          </span>
        </div>
        <span className="flex items-center">
          <ApperIcon name="Clock" size={14} className="mr-1" />
          {format(new Date(timestamp), 'h:mm a')}
        </span>
      </div>
    </Card>
  )
}

export default FeedbackCard