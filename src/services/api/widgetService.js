import { delay } from '@/utils/helpers'

class WidgetService {
  constructor() {
    this.storageKey = 'feedbackpulse_widget_config'
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultConfig = {
        Id: 1,
        position: 'bottom-right',
        primaryColor: '#6366F1',
        triggerDelay: 3000,
        showOnPages: ['*'],
        emailRecipients: [],
        enabled: true,
        branding: true,
        customCss: '',
        thankYouMessage: 'Thank you for your feedback!'
      }
      localStorage.setItem(this.storageKey, JSON.stringify(defaultConfig))
    }
  }

  async getConfig() {
    await delay(200)
    const data = JSON.parse(localStorage.getItem(this.storageKey))
    return { ...data }
  }

  async updateConfig(config) {
    await delay(300)
    const updatedConfig = {
      ...config,
      Id: 1,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem(this.storageKey, JSON.stringify(updatedConfig))
    return { ...updatedConfig }
  }

  async resetConfig() {
    await delay(200)
    localStorage.removeItem(this.storageKey)
    this.initializeData()
    return this.getConfig()
  }

  generateEmbedCode(config) {
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.feedbackpulse.com/widget.js';
    script.setAttribute('data-position', '${config.position}');
    script.setAttribute('data-color', '${config.primaryColor}');
    script.setAttribute('data-delay', '${config.triggerDelay}');
    script.setAttribute('data-enabled', '${config.enabled}');
    document.head.appendChild(script);
  })();
</script>`
  }
}

export const widgetService = new WidgetService()