import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/atoms/Card'
import StarRating from '@/components/atoms/StarRating'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const WidgetPreview = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setIsOpen(false)
        setRating(0)
        setComment('')
      }, 2000)
    }
  }

  const widgetStyle = {
    position: config.position || 'bottom-right',
    primaryColor: config.primaryColor || '#6366F1'
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  return (
    <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <ApperIcon name="Monitor" size={48} className="mx-auto mb-2" />
          <p className="text-sm">Website Preview</p>
        </div>
      </div>

      {/* Widget Button */}
      <motion.div
        className={`absolute ${positionClasses[widgetStyle.position]} z-10`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-elevated flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: widgetStyle.primaryColor }}
            >
              <ApperIcon name="MessageCircle" size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Widget Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute bottom-0 right-0 mb-16"
            >
              <Card className="w-80 p-6">
                {!submitted ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Share your feedback</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="X"
                        onClick={() => setIsOpen(false)}
                        className="p-1 h-auto"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How was your experience?
                        </label>
                        <StarRating
                          rating={rating}
                          onChange={setRating}
                          interactive={true}
                          size={24}
                          className="justify-center"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tell us more (optional)
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Your feedback helps us improve..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="w-full"
                        style={{ backgroundColor: rating > 0 ? widgetStyle.primaryColor : undefined }}
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Check" size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Thank you!</h3>
                    <p className="text-sm text-gray-600">Your feedback has been submitted.</p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default WidgetPreview