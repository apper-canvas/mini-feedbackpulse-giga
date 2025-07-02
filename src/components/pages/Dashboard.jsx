import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import FeedbackCard from '@/components/molecules/FeedbackCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Chart from 'react-apexcharts'
import { feedbackService } from '@/services/api/feedbackService'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [recentFeedback, setRecentFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [analyticsData, feedbackData] = await Promise.all([
        feedbackService.getAnalytics(),
        feedbackService.getAll()
      ])
      
      setAnalytics(analyticsData)
      setRecentFeedback(feedbackData.slice(0, 5))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleDeleteFeedback = async (id) => {
    try {
      await feedbackService.delete(id)
      setRecentFeedback(prev => prev.filter(f => f.Id !== id))
      toast.success('Feedback deleted successfully')
    } catch (err) {
      toast.error('Failed to delete feedback')
    }
  }

  const handleReplyFeedback = (feedback) => {
    toast.info('Reply feature coming soon!')
  }

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#6366F1'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['1★', '2★', '3★', '4★', '5★'],
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px'
      }
    }
  }

  if (loading) return <Loading type="metrics" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Responses"
          value={analytics?.totalResponses?.toLocaleString() || '0'}
          change="+12% from last month"
          changeType="positive"
          icon="MessageSquare"
          gradient={true}
        />
        <MetricCard
          title="Average Rating"
          value={analytics?.avgRating?.toFixed(1) || '0.0'}
          change="+0.3 from last month"
          changeType="positive"
          icon="Star"
          gradient={true}
        />
        <MetricCard
          title="Response Rate"
          value="24.8%"
          change="+2.1% from last month"
          changeType="positive"
          icon="TrendingUp"
          gradient={true}
        />
        <MetricCard
          title="Satisfaction Score"
          value="92%"
          change="+5% from last month"
          changeType="positive"
          icon="Heart"
          gradient={true}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Rating Distribution</h2>
            <Button variant="ghost" size="sm" icon="Download">
              Export
            </Button>
          </div>
          
          {analytics?.ratingDistribution && (
            <Chart
              options={chartOptions}
              series={[{
                name: 'Responses',
                data: Object.values(analytics.ratingDistribution)
              }]}
              type="area"
              height={280}
            />
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="secondary"
              icon="Settings"
            >
              Customize Widget
            </Button>
            <Button
              className="w-full justify-start"
              variant="secondary"
              icon="Mail"
            >
              Configure Notifications
            </Button>
            <Button
              className="w-full justify-start"
              variant="secondary"
              icon="Download"
            >
              Export Feedback Data
            </Button>
            <Button
              className="w-full justify-start"
              variant="secondary"
              icon="Code"
            >
              Get Embed Code
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
          <Button variant="ghost" size="sm" icon="ExternalLink">
            View All
          </Button>
        </div>

        {recentFeedback.length === 0 ? (
          <Empty
            title="No feedback yet"
            description="Install your widget to start collecting customer feedback"
            icon="MessageCircle"
            actionLabel="Set up Widget"
          />
        ) : (
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <FeedbackCard
                key={feedback.Id}
                feedback={feedback}
                onDelete={handleDeleteFeedback}
                onReply={handleReplyFeedback}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard