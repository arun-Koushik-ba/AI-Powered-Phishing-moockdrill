import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, Clock, ArrowLeft, Loader2, MessageCircle, Phone, AlertTriangle } from 'lucide-react';
import { emailService } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/utils/storage';
interface DeliveryMethodProps {
  emailContent: string;
  onSend: () => void;
  onGoBack: () => void;
}
const DeliveryMethod = ({
  emailContent,
  onSend,
  onGoBack
}: DeliveryMethodProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState('immediate');
  const [messageType, setMessageType] = useState('email');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const {
    toast
  } = useToast();
  const handleSend = async () => {
    if (!recipientContact.trim()) {
      toast({
        title: "Contact Required",
        description: `Please enter ${messageType === 'email' ? 'email address' : 'phone number'}.`,
        variant: "destructive"
      });
      return;
    }

    // Validate email format if email is selected
    if (messageType === 'email' && !isValidEmail(recipientContact)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g., user@gmail.com)",
        variant: "destructive"
      });
      return;
    }

    // Validate phone format if SMS/WhatsApp is selected
    if ((messageType === 'sms' || messageType === 'whatsapp') && !isValidPhone(recipientContact)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code (e.g., +91 9876543210)",
        variant: "destructive"
      });
      return;
    }
    setIsSending(true);
    try {
      const name = recipientName.trim() || 'User';

      // Extract subject and content from emailContent
      const lines = emailContent.split('\n');
      const scamLinkIndex = lines.findIndex(line => line.includes('Scam Link:'));
      const scamLink = scamLinkIndex !== -1 ? lines[scamLinkIndex].replace('Scam Link: ', '') : 'https://example.com/verify';
      const content = lines.slice(0, scamLinkIndex !== -1 ? scamLinkIndex : lines.length).join('\n');
      const subject = lines[0].length < 100 ? lines[0] : "Important Account Verification Required";
      if (deliveryMethod === 'scheduled') {
        toast({
          title: `${messageType.charAt(0).toUpperCase() + messageType.slice(1)} Scheduled`,
          description: `Mock drill ${messageType} scheduled for ${scheduledDate} at ${scheduledTime}`,
          className: "bg-blue-600 text-white"
        });
        setTimeout(async () => {
          await sendMessage(messageType, recipientContact, name, subject, content, scamLink);
          onSend();
        }, 2000);
      } else {
        await sendMessage(messageType, recipientContact, name, subject, content, scamLink);
        toast({
          title: "Mock Drill Sent",
          description: `Successfully sent via ${messageType} to ${recipientContact}`,
          className: "bg-green-600 text-white"
        });
        onSend();
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: error instanceof Error ? error.message : `Failed to send mock drill ${messageType}`,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  const sendMessage = async (type: string, contact: string, name: string, subject: string, content: string, scamLink: string) => {
    switch (type) {
      case 'email':
        await emailService.sendMockDrillEmail(contact, name, subject, content, scamLink);
        break;
      case 'sms':
        await emailService.sendSMS(contact, content, scamLink);
        break;
      case 'whatsapp':
        await emailService.sendWhatsApp(contact, content, scamLink);
        break;
    }
  };
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+\d{1,3}\s?\d{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  const getMessageIcon = () => {
    switch (messageType) {
      case 'email':
        return Mail;
      case 'sms':
        return Phone;
      case 'whatsapp':
        return MessageCircle;
      default:
        return Mail;
    }
  };
  const getPlaceholder = () => {
    switch (messageType) {
      case 'email':
        return 'user@gmail.com';
      case 'sms':
        return '+91 9876543210';
      case 'whatsapp':
        return '+91 9876543210';
      default:
        return 'Enter contact...';
    }
  };
  const getServiceStatus = () => {
    const settings = storage.getSettings();
    const emailConfig = settings.emailConfig || {};
    if (messageType === 'email') {
      if (emailConfig.emailjs && emailService.isEmailJSConfigured(emailConfig.emailjs)) {
        return {
          configured: true,
          service: 'EmailJS',
          instructions: emailService.getEmailJSInstructions()
        };
      } else {
        return {
          configured: false,
          service: 'Email',
          instructions: emailService.getEmailJSInstructions()
        };
      }
    } else if (messageType === 'sms') {
      return {
        configured: !!emailConfig.sms?.apiKey,
        service: 'SMS',
        instructions: emailService.getSmsInstructions()
      };
    } else if (messageType === 'whatsapp') {
      return {
        configured: !!emailConfig.whatsapp?.apiKey,
        service: 'WhatsApp',
        instructions: emailService.getWhatsAppInstructions()
      };
    }
    return {
      configured: false,
      service: messageType,
      instructions: 'Configure in Account Settings'
    };
  };
  const serviceStatus = getServiceStatus();
  const MessageIcon = getMessageIcon();
  return <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-navy dark:text-white">Send Mock Drill</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose message type, delivery method and send the phishing simulation
              </CardDescription>
            </div>
          </div>
          <Button onClick={onGoBack} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Status Alert */}
        {!serviceStatus.configured}

        {/* Message Type Selection */}
        <div className="space-y-4">
          <Label className="text-dark-blue font-medium dark:text-white">
            Message Type
          </Label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger className="border-2 border-cream focus:border-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="email">📧 Email {serviceStatus.configured && messageType === 'email' ? `(${serviceStatus.service})` : ''}</SelectItem>
              <SelectItem value="sms">📱 SMS {serviceStatus.configured && messageType === 'sms' ? '(Configured)' : '(Setup Required)'}</SelectItem>
              <SelectItem value="whatsapp">💬 WhatsApp {serviceStatus.configured && messageType === 'whatsapp' ? '(Configured)' : '(Setup Required)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Preview */}
        

        {/* Delivery Method Selection */}
        <div className="space-y-4">
          <Label className="text-dark-blue font-medium dark:text-white">
            Delivery Method
          </Label>
          <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <SelectTrigger className="border-2 border-cream focus:border-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="immediate">Send Immediately</SelectItem>
              <SelectItem value="scheduled">Schedule for Later</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Scheduled Delivery Options */}
        {deliveryMethod === 'scheduled' && <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate" className="text-dark-blue font-medium dark:text-white">
                Date
              </Label>
              <Input id="scheduledDate" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <Label htmlFor="scheduledTime" className="text-dark-blue font-medium dark:text-white">
                Time
              </Label>
              <Input id="scheduledTime" type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>}

        {/* Target Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipientName" className="text-dark-blue font-medium dark:text-white">
              Target Name
            </Label>
            <Input id="recipientName" placeholder="Enter target's name..." value={recipientName} onChange={e => setRecipientName(e.target.value)} className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          
          <div>
            <Label htmlFor="recipients" className="text-dark-blue font-medium dark:text-white">
              {messageType === 'email' ? 'Email Address' : 'Phone Number'}
            </Label>
            <Input id="recipients" placeholder={getPlaceholder()} value={recipientContact} onChange={e => setRecipientContact(e.target.value)} className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <p className="text-xs text-dark-blue/60 mt-1 dark:text-gray-400">
              {messageType === 'email' ? 'Example: user@gmail.com' : 'Example: +91 9876543210 (include country code)'}
            </p>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={isSending || !recipientContact.trim()} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
            {isSending ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </> : <>
                <MessageIcon className="w-4 h-4 mr-2" />
                {deliveryMethod === 'scheduled' ? `Schedule ${messageType.charAt(0).toUpperCase() + messageType.slice(1)}` : 'Send Now'}
              </>}
          </Button>
        </div>

        {/* Warning Notice */}
        
      </CardContent>
    </Card>;
};
export default DeliveryMethod;