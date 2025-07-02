import React from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available",
  description = "Get started by creating your first item",
  icon = "Inbox",
  actionLabel,
  onAction
}) => {
  return (
    <Card className="p-12 text-center gradient-card">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={32} className="text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            icon="Plus"
            className="mx-auto"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default Empty