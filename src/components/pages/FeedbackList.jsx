import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FeedbackCard from '@/components/molecules/FeedbackCard'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { feedbackService } from '@/services/api/feedbackService'
import { toast } from 'react-toastify'

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])

  const loadFeedback = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await feedbackService.getAll()
      setFeedback(data)
      setFilteredFeedback(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedback()
  }, [])

  useEffect(() => {
    let filtered = feedback

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(item => item.rating === parseInt(ratingFilter))
    }

    setFilteredFeedback(filtered)
  }, [feedback, searchTerm, ratingFilter])

  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.delete(id)
      setFeedback(prev => prev.filter(f => f.Id !== id))
      toast.success('Feedback deleted successfully')
    } catch (err) {
      toast.error('Failed to delete feedback')
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedItems.map(id => feedbackService.delete(id)))
      setFeedback(prev => prev.filter(f => !selectedItems.includes(f.Id)))
      setSelectedItems([])
      toast.success(`${selectedItems.length} items deleted successfully`)
    } catch (err) {
      toast.error('Failed to delete selected items')
    }
  }

  const handleReplyFeedback = (feedback) => {
    toast.info('Reply feature coming soon!')
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  if (loading) return <Loading type="card" count={5} />
  if (error) return <Error message={error} onRetry={loadFeedback} />

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={clearSearch}
              placeholder="Search feedback..."
              className="w-full sm:w-80"
            />
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                icon="Trash2"
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedItems.length})
              </Button>
            )}
            <Button variant="secondary" size="sm" icon="Download">
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <Empty
          title={searchTerm || ratingFilter !== 'all' ? "No matching feedback" : "No feedback yet"}
          description={searchTerm || ratingFilter !== 'all' ? "Try adjusting your filters" : "Install your widget to start collecting customer feedback"}
          icon="MessageCircle"
          actionLabel={searchTerm || ratingFilter !== 'all' ? "Clear Filters" : "Set up Widget"}
          onAction={() => {
            setSearchTerm('')
            setRatingFilter('all')
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredFeedback.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <FeedbackCard
                feedback={item}
                onDelete={handleDeleteFeedback}
                onReply={handleReplyFeedback}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination would go here */}
      {filteredFeedback.length > 10 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{Math.min(10, filteredFeedback.length)}</span> of{' '}
              <span className="font-medium">{filteredFeedback.length}</span> results
            </p>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default FeedbackList