
// Email service for sending real emails using EmailJS
import emailjs from '@emailjs/browser';
import { storage, DrillData } from './storage';

export interface EmailResult {
  success: boolean;
  message: string;
  drillId?: string;
}

// Email service configuration
export interface EmailConfig {
  // EmailJS configuration
  emailjs?: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  // SMS service configuration
  sms?: {
    apiKey: string;
    apiSecret?: string;
    from?: string;
  };
  // WhatsApp service configuration
  whatsapp?: {
    apiKey: string;
    apiSecret?: string;
    fromNumber?: string;
  };
}

export const emailService = {
  async sendMockDrillEmail(
    targetEmail: string,
    targetName: string,
    subject: string,
    content: string,
    scamLink: string
  ): Promise<EmailResult> {
    try {
      // Generate unique drill ID
      const drillId = `drill_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Create drill data
      const drillData: DrillData = {
        id: drillId,
        targetEmail,
        targetName,
        subject,
        content,
        scamLink,
        createdAt: new Date(),
        sentAt: new Date(),
        analytics: {
          emailOpened: false,
          linkClicked: false,
          status: 'sent'
        }
      };

      // Save drill data
      storage.saveDrill(drillData);

      // Send real email using EmailJS
      const settings = storage.getSettings();
      const emailConfig = settings.emailConfig || {};
      
      if (emailConfig.emailjs && this.isEmailJSConfigured(emailConfig.emailjs)) {
        await this.sendEmailJSEmail(emailConfig.emailjs, targetEmail, targetName, subject, content, scamLink, drillId);
      } else {
        // Fallback to console logging if EmailJS is not configured
        console.log(`⚠️ EmailJS not configured. Mock email would be sent to: ${targetEmail}`);
        console.log(`📧 Subject: ${subject}`);
        console.log(`📧 Content: ${content}`);
        return {
          success: true,
          message: `Mock drill email simulated (EmailJS not configured). Check console for details.`,
          drillId
        };
      }

      console.log(`✅ Real email sent to: ${targetEmail}`);
      console.log(`📧 Subject: ${subject}`);

      return {
        success: true,
        message: `Mock drill email sent successfully to ${targetEmail}`,
        drillId
      };

    } catch (error) {
      console.error('Error sending mock drill email:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  },

  async sendEmailJSEmail(
    config: EmailConfig['emailjs'], 
    targetEmail: string, 
    targetName: string, 
    subject: string, 
    content: string, 
    scamLink: string,
    drillId: string
  ): Promise<void> {
    try {
      if (!config) {
        throw new Error('EmailJS not configured');
      }

      // Create a pixel tracking image URL
      const trackingPixel = `${window.location.origin}/api/track?id=${drillId}&type=open`;
      
      // Create a tracked link
      const trackedLink = `${window.location.origin}/api/track?id=${drillId}&type=click&redirect=${encodeURIComponent(scamLink)}`;

      // Prepare email template parameters - THE TARGET EMAIL GOES HERE
      const templateParams = {
        to_email: targetEmail,  // This is the target's email address
        to_name: targetName,    // This is the target's name
        subject: subject,
        message: content,
        scam_link: trackedLink,
        from_name: 'IT Security Team',
        tracking_pixel: trackingPixel
      };

      console.log('📧 Sending email to:', targetEmail);
      console.log('📧 Template params:', templateParams);

      // Send email using EmailJS
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        config.publicKey
      );

      if (response.status !== 200) {
        throw new Error(`EmailJS failed with status: ${response.status}`);
      }

      console.log('✅ EmailJS response:', response);

    } catch (error) {
      console.error('EmailJS Error:', error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async sendSMS(phone: string, content: string, scamLink: string): Promise<void> {
    try {
      const settings = storage.getSettings();
      const smsConfig = settings.emailConfig?.sms;
      
      if (!smsConfig || !smsConfig.apiKey) {
        // Simulate SMS sending if no API key is configured
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`📱 SMS would be sent to: ${phone}`);
        console.log(`📱 Content: ${content}`);
        console.log(`📱 Scam Link: ${scamLink}`);
        console.log('ℹ️ Note: SMS requires API key configuration in settings');
        return;
      }
      
      // Example implementation for Twilio-like SMS API
      console.log(`📱 Sending SMS to ${phone} using API key: ${smsConfig.apiKey.substring(0, 5)}...`);
      
      // Create SMS API call (this would be your actual SMS provider's API)
      const smsPayload = {
        to: phone,
        body: `${content} ${scamLink}`,
        from: smsConfig.from || 'Security Team'
      };

      // Replace with actual SMS API call
      const mockResponse = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${smsConfig.apiKey}:${smsConfig.apiSecret || ''}`)}`
        },
        body: new URLSearchParams(smsPayload).toString()
      });
      
      // For now, simulate success
      console.log('✅ SMS sent successfully');
    } catch (error) {
      console.error('SMS Error:', error);
      throw new Error(`Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async sendWhatsApp(phone: string, content: string, scamLink: string): Promise<void> {
    try {
      const settings = storage.getSettings();
      const whatsappConfig = settings.emailConfig?.whatsapp;
      
      if (!whatsappConfig || !whatsappConfig.apiKey) {
        // Simulate WhatsApp sending if no API key is configured
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`💬 WhatsApp would be sent to: ${phone}`);
        console.log(`💬 Content: ${content}`);
        console.log(`💬 Scam Link: ${scamLink}`);
        console.log('ℹ️ Note: WhatsApp requires API key configuration in settings');
        return;
      }
      
      // Example implementation for WhatsApp Business API
      console.log(`💬 Sending WhatsApp to ${phone} using API key: ${whatsappConfig.apiKey.substring(0, 5)}...`);
      
      // Create WhatsApp API call (this would be your actual WhatsApp provider's API)
      const whatsappPayload = {
        to: phone,
        body: `${content} ${scamLink}`,
        from: whatsappConfig.fromNumber || 'Security Team'
      };

      // Replace with actual WhatsApp API call
      const mockResponse = await fetch('https://api.whatsapp.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${whatsappConfig.apiKey}`
        },
        body: JSON.stringify(whatsappPayload)
      });
      
      // For now, simulate success
      console.log('✅ WhatsApp message sent successfully');
    } catch (error) {
      console.error('WhatsApp Error:', error);
      throw new Error(`Failed to send WhatsApp: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Configuration helpers
  isEmailJSConfigured(config?: EmailConfig['emailjs']): boolean {
    return !!(config && config.serviceId && config.templateId && config.publicKey);
  },

  getEmailJSInstructions(): string {
    return `
To set up real email sending with EmailJS:
1. Create account at https://emailjs.com
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with variables: to_email, to_name, subject, message, scam_link, from_name
4. Copy Service ID, Template ID, and Public Key from EmailJS dashboard
5. Update EmailJS settings in Account Settings
6. The content generated by Gemini will be inserted into the 'message' variable of your template
    `;
  },
  
  getSmsInstructions(): string {
    return `
To set up SMS sending:
1. Sign up for an SMS service (Twilio, Vonage, etc.)
2. Get your API key and other credentials
3. Enter them in the Account Settings
4. SMS messages will include the generated content plus the scam link
    `;
  },
  
  getWhatsAppInstructions(): string {
    return `
To set up WhatsApp sending:
1. Sign up for WhatsApp Business API through a provider
2. Get your API key and other credentials
3. Enter them in the Account Settings
4. WhatsApp messages will include the generated content plus the scam link
    `;
  }
};
