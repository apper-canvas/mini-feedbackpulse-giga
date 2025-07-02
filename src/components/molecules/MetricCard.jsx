import React from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  gradient = false,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </Card>
    )
  }

  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  const changeIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus'
  }

  return (
    <Card hover={true} gradient={gradient} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50">
            <ApperIcon name={icon} size={20} className="text-primary-600" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <motion.p 
            className="text-2xl font-bold text-gray-900 gradient-text"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              <ApperIcon name={changeIcons[changeType]} size={12} className="mr-1" />
              {change}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MetricCard