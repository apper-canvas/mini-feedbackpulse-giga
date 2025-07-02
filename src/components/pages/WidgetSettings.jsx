import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import WidgetPreview from '@/components/molecules/WidgetPreview'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { widgetService } from '@/services/api/widgetService'
import { toast } from 'react-toastify'

const WidgetSettings = () => {
  const [config, setConfig] = useState({
    position: 'bottom-right',
    primaryColor: '#6366F1',
    triggerDelay: 3000,
    showOnPages: ['*'],
    emailRecipients: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [embedCode, setEmbedCode] = useState('')

  const loadConfig = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await widgetService.getConfig()
      setConfig(data)
      generateEmbedCode(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const generateEmbedCode = (widgetConfig) => {
    const code = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.feedbackpulse.com/widget.js';
    script.setAttribute('data-position', '${widgetConfig.position}');
    script.setAttribute('data-color', '${widgetConfig.primaryColor}');
    script.setAttribute('data-delay', '${widgetConfig.triggerDelay}');
    document.head.appendChild(script);
  })();
</script>`
    setEmbedCode(code)
  }

  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...config, [field]: value }
    setConfig(updatedConfig)
    generateEmbedCode(updatedConfig)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await widgetService.updateConfig(config)
      toast.success('Widget settings saved successfully')
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code copied to clipboard')
  }

  if (loading) return <Loading type="card" />
  if (error) return <Error message={error} onRetry={loadConfig} />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Widget Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={config.position}
                onChange={(e) => handleConfigChange('position', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex space-x-3">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                  className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                  placeholder="#6366F1"
                  className="flex-1"
                />
              </div>
            </div>

            <Input
              label="Trigger Delay (ms)"
              type="number"
              value={config.triggerDelay}
              onChange={(e) => handleConfigChange('triggerDelay', parseInt(e.target.value))}
              placeholder="3000"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Embed Code</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copy this code to your website
              </label>
              <div className="relative">
                <textarea
                  value={embedCode}
                  readOnly
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs resize-none"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Copy"
                  onClick={copyEmbedCode}
                  className="absolute top-2 right-2"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex space-x-3">
          <Button
            onClick={handleSave}
            loading={saving}
            className="flex-1"
          >
            Save Settings
          </Button>
          <Button
            variant="secondary"
            onClick={loadConfig}
            icon="RefreshCw"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Live Preview</h2>
          
          <motion.div
            key={JSON.stringify(config)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WidgetPreview config={config} />
          </motion.div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Installation Guide</h2>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Copy the embed code</p>
                <p>Use the "Copy" button above to copy the widget code to your clipboard.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Add to your website</p>
                <p>Paste the code before the closing &lt;/body&gt; tag on every page where you want the widget to appear.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Test and customize</p>
                <p>Visit your website to see the widget in action, then return here to make any adjustments.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WidgetSettings