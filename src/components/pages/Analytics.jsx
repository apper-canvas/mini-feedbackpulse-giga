import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Chart from 'react-apexcharts'
import { analyticsService } from '@/services/api/analyticsService'
import { toast } from 'react-toastify'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await analyticsService.getDetailedAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const exportData = () => {
    toast.info('Export feature coming soon!')
  }

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#6366F1', '#8B5CF6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: analytics?.timeline?.labels || [],
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
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'light'
    }
  }

  const ratingDistributionOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false }
    },
    colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'],
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%'
      }
    }
  }

  const sentimentOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#10B981', '#EAB308', '#EF4444'],
    xaxis: {
      categories: ['Positive', 'Neutral', 'Negative']
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8
      }
    },
    dataLabels: { enabled: false }
  }

  if (loading) return <Loading type="metrics" />
  if (error) return <Error message={error} onRetry={loadAnalytics} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Deep insights into your customer feedback</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="secondary" icon="Download" onClick={exportData}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Responses"
          value={analytics?.totalResponses?.toLocaleString() || '0'}
          change="+12% vs previous period"
          changeType="positive"
          icon="MessageSquare"
          gradient={true}
        />
        <MetricCard
          title="Average Rating"
          value={analytics?.avgRating?.toFixed(1) || '0.0'}
          change="+0.3 vs previous period"
          changeType="positive"
          icon="Star"
          gradient={true}
        />
        <MetricCard
          title="Response Rate"
          value={analytics?.responseRate || '0%'}
          change="+2.1% vs previous period"
          changeType="positive"
          icon="TrendingUp"
          gradient={true}
        />
        <MetricCard
          title="Net Promoter Score"
          value={analytics?.nps || '0'}
          change="+5 vs previous period"
          changeType="positive"
          icon="Heart"
          gradient={true}
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Feedback Timeline</h2>
            <Button variant="ghost" size="sm" icon="Download">
              Export
            </Button>
          </div>
          
          {analytics?.timeline && (
            <Chart
              options={chartOptions}
              series={[
                {
                  name: 'Responses',
                  data: analytics.timeline.responses
                },
                {
                  name: 'Average Rating',
                  data: analytics.timeline.ratings
                }
              ]}
              type="line"
              height={300}
            />
          )}
        </Card>

        {/* Rating Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Rating Distribution</h2>
            <Button variant="ghost" size="sm" icon="Download">
              Export
            </Button>
          </div>
          
          {analytics?.ratingDistribution && (
            <Chart
              options={ratingDistributionOptions}
              series={Object.values(analytics.ratingDistribution)}
              type="donut"
              height={300}
            />
          )}
        </Card>

        {/* Sentiment Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h2>
            <Button variant="ghost" size="sm" icon="Download">
              Export
            </Button>
          </div>
          
          {analytics?.sentiment && (
            <Chart
              options={sentimentOptions}
              series={[{
                name: 'Feedback Count',
                data: Object.values(analytics.sentiment)
              }]}
              type="bar"
              height={300}
            />
          )}
        </Card>

        {/* Top Pages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Pages</h2>
            <Button variant="ghost" size="sm" icon="ExternalLink">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {analytics?.topPages?.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.url}</p>
                  <p className="text-xs text-gray-500">{page.responses} responses</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{page.avgRating}/5</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.round(page.avgRating) ? 'bg-amber-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-8">No page data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {analytics?.insights?.positivePercentage || '0'}%
            </div>
            <p className="text-sm text-green-700">Positive Feedback</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {analytics?.insights?.avgResponseTime || '0'}s
            </div>
            <p className="text-sm text-blue-700">Avg Response Time</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {analytics?.insights?.peakHour || '12:00'}
            </div>
            <p className="text-sm text-purple-700">Peak Feedback Hour</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Analytics