import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { emailService } from "@/services/api/emailService";
import { toast } from "react-toastify";

const EmailConfig = () => {
  const [config, setConfig] = useState({
    recipients: [],
    template: {
      subject: 'New Feedback Received - {{rating}} stars',
      body: `Hi there,

You've received new feedback on your website:

Rating: {{rating}} stars
Comment: {{comment}}
Page: {{pageUrl}}
Time: {{timestamp}}

Best regards,
FeedbackPulse Team`
    },
    notifications: {
      instant: true,
      daily: false,
      weekly: true
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  const loadConfig = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await emailService.getConfig()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleAddEmail = () => {
    if (newEmail && !config.recipients.includes(newEmail)) {
      setConfig(prev => ({
        ...prev,
        recipients: [...prev.recipients, newEmail]
      }))
      setNewEmail('')
    }
  }

  const handleRemoveEmail = (email) => {
    setConfig(prev => ({
      ...prev,
      recipients: prev.recipients.filter(e => e !== email)
    }))
  }

  const handleTemplateChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      template: {
        ...prev.template,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await emailService.updateConfig(config)
      toast.success('Email settings saved successfully')
    } catch (err) {
      toast.error('Failed to save email settings')
    } finally {
      setSaving(false)
    }
  }

  const sendTestEmail = async () => {
    try {
      await emailService.sendTest(config.recipients[0] || 'test@example.com')
      toast.success('Test email sent successfully')
    } catch (err) {
      toast.error('Failed to send test email')
    }
  }

  if (loading) return <Loading type="card" />
  if (error) return <Error message={error} onRetry={loadConfig} />

  return (
    <div className="max-w-4xl space-y-8">
      {/* Email Recipients */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Email Recipients</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-3">
            <Input
              type="email"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
            />
            <Button onClick={handleAddEmail} icon="Plus">
              Add
            </Button>
          </div>

          {config.recipients.length > 0 && (
            <div className="space-y-2">
              {config.recipients.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Email Template */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Email Template</h2>
        
        <div className="space-y-4">
          <Input
            label="Subject Line"
            value={config.template.subject}
            onChange={(e) => handleTemplateChange('subject', e.target.value)}
            placeholder="New Feedback Received - {{rating}} stars"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>
            <textarea
              value={config.template.body}
              onChange={(e) => handleTemplateChange('body', e.target.value)}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Enter email template..."
            />
          </div>

<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Available Variables</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <span>{'{{rating}}'} - Star rating</span>
              <span>{'{{comment}}'} - Feedback comment</span>
              <span>{'{{email}}'} - Customer email</span>
              <span>{'{{pageUrl}}'} - Page URL</span>
              <span>{'{{timestamp}}'} - Submission time</span>
              <span>{'{{userAgent}}'} - Browser info</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Instant Notifications</h4>
              <p className="text-sm text-gray-600">Send email immediately when feedback is received</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifications.instant}
                onChange={(e) => handleNotificationChange('instant', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Daily Summary</h4>
              <p className="text-sm text-gray-600">Daily digest of all feedback received</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifications.daily}
                onChange={(e) => handleNotificationChange('daily', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Report</h4>
              <p className="text-sm text-gray-600">Weekly analytics and insights report</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifications.weekly}
                onChange={(e) => handleNotificationChange('weekly', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={handleSave}
          loading={saving}
          className="flex-1"
        >
          Save Email Settings
        </Button>
        <Button
          variant="secondary"
          onClick={sendTestEmail}
          icon="Send"
          disabled={config.recipients.length === 0}
        >
          Send Test Email
        </Button>
        <Button
          variant="ghost"
          onClick={loadConfig}
          icon="RefreshCw"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default EmailConfig