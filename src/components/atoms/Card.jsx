import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  elevated = false,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-all duration-200'
  const shadowClasses = elevated ? 'shadow-elevated' : 'shadow-card'
  const gradientClasses = gradient ? 'gradient-card border-transparent' : ''
  const hoverClasses = hover ? 'hover:shadow-elevated hover:scale-[1.02]' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${shadowClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card