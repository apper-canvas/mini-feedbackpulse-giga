import { delay } from '@/utils/helpers'

class EmailService {
  constructor() {
    this.storageKey = 'feedbackpulse_email_config'
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultConfig = {
        Id: 1,
        recipients: ['admin@example.com'],
        template: {
          subject: 'New Feedback Received - {{rating}} stars',
          body: `Hi there,

You've received new feedback on your website:

Rating: {{rating}} stars
Comment: {{comment}}
Page: {{pageUrl}}
Customer: {{email}}
Time: {{timestamp}}

Best regards,
FeedbackPulse Team`
        },
        notifications: {
          instant: true,
          daily: false,
          weekly: true
        },
        smtpSettings: {
          host: '',
          port: 587,
          username: '',
          password: '',
          secure: false
        }
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

  async sendTest(email) {
    await delay(500)
    // Simulate test email sending
    console.log(`Test email sent to: ${email}`)
    return { success: true, message: 'Test email sent successfully' }
  }

  async sendNotification(feedback) {
    await delay(300)
    const config = await this.getConfig()
    
    if (!config.notifications.instant) {
      return { success: false, message: 'Instant notifications disabled' }
    }

    // Simulate email sending
    console.log('Sending feedback notification:', feedback)
    return { success: true, message: 'Notification sent successfully' }
  }
}

export const emailService = new EmailService()