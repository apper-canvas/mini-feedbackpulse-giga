import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StarRating = ({
  rating = 0,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  className = ''
}) => {
  const handleStarClick = (starValue) => {
    if (interactive && onChange) {
      onChange(starValue)
    }
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= rating
        
        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleStarClick(starValue)}
            disabled={!interactive}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              transition-all duration-200 focus:outline-none
            `}
            whileTap={interactive ? { scale: 0.9 } : {}}
            whileHover={interactive ? { scale: 1.1 } : {}}
          >
            <ApperIcon
              name="Star"
              size={size}
              className={`
                transition-all duration-200
                ${isFilled 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-gray-300 hover:text-amber-400'
                }
              `}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

export default StarRating