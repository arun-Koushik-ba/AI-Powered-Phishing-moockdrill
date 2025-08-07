
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Phone, Save } from 'lucide-react';
import { storage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

const MessageServiceSettings = () => {
  const [emailjsConfig, setEmailjsConfig] = useState({
    serviceId: '',
    templateId: '',
    publicKey: ''
  });
  const [smsConfig, setSmsConfig] = useState({
    apiKey: '',
    apiSecret: '',
    from: ''
  });
  const [whatsappConfig, setWhatsappConfig] = useState({
    apiKey: '',
    apiSecret: '',
    fromNumber: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const settings = storage.getSettings();
    const emailConfig = settings.emailConfig || {};
    
    setEmailjsConfig(emailConfig.emailjs || {
      serviceId: '',
      templateId: '',
      publicKey: ''
    });
    setSmsConfig({
      apiKey: emailConfig.sms?.apiKey || '',
      apiSecret: emailConfig.sms?.apiSecret || '',
      from: emailConfig.sms?.from || ''
    });
    setWhatsappConfig({
      apiKey: emailConfig.whatsapp?.apiKey || '',
      apiSecret: emailConfig.whatsapp?.apiSecret || '',
      fromNumber: emailConfig.whatsapp?.fromNumber || ''
    });
  }, []);

  const handleSave = () => {
    try {
      const currentSettings = storage.getSettings();
      const updatedSettings = {
        ...currentSettings,
        emailConfig: {
          emailjs: emailjsConfig.serviceId ? emailjsConfig : undefined,
          sms: smsConfig.apiKey ? smsConfig : undefined,
          whatsapp: whatsappConfig.apiKey ? whatsappConfig : undefined
        }
      };
      
      storage.saveSettings(updatedSettings);
      
      toast({
        title: "Settings Saved",
        description: "Message service configurations have been updated successfully.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save message service settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-navy dark:text-white">Message Service Configuration</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Configure email, SMS, and WhatsApp services for security drill delivery
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </TabsTrigger>
          </TabsList>

          {/* EmailJS Configuration */}
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy dark:text-white">EmailJS Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailjs-service-id" className="text-dark-blue font-medium dark:text-white">
                    Service ID
                  </Label>
                  <Input
                    id="emailjs-service-id"
                    placeholder="service_abc123"
                    value={emailjsConfig.serviceId}
                    onChange={(e) => setEmailjsConfig({...emailjsConfig, serviceId: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailjs-template-id" className="text-dark-blue font-medium dark:text-white">
                    Template ID
                  </Label>
                  <Input
                    id="emailjs-template-id"
                    placeholder="template_xyz789"
                    value={emailjsConfig.templateId}
                    onChange={(e) => setEmailjsConfig({...emailjsConfig, templateId: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailjs-public-key" className="text-dark-blue font-medium dark:text-white">
                  Public Key
                </Label>
                <Input
                  id="emailjs-public-key"
                  placeholder="user_abcdef123456"
                  value={emailjsConfig.publicKey}
                  onChange={(e) => setEmailjsConfig({...emailjsConfig, publicKey: e.target.value})}
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* SMS Configuration */}
          <TabsContent value="sms" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy dark:text-white">SMS Service Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sms-api-key" className="text-dark-blue font-medium dark:text-white">
                    API Key
                  </Label>
                  <Input
                    id="sms-api-key"
                    type="password"
                    placeholder="Your SMS API key"
                    value={smsConfig.apiKey}
                    onChange={(e) => setSmsConfig({...smsConfig, apiKey: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sms-api-secret" className="text-dark-blue font-medium dark:text-white">
                    API Secret
                  </Label>
                  <Input
                    id="sms-api-secret"
                    type="password"
                    placeholder="Your SMS API secret"
                    value={smsConfig.apiSecret}
                    onChange={(e) => setSmsConfig({...smsConfig, apiSecret: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sms-from" className="text-dark-blue font-medium dark:text-white">
                  From Number/ID
                </Label>
                <Input
                  id="sms-from"
                  placeholder="+1234567890 or ShortCode"
                  value={smsConfig.from}
                  onChange={(e) => setSmsConfig({...smsConfig, from: e.target.value})}
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* WhatsApp Configuration */}
          <TabsContent value="whatsapp" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy dark:text-white">WhatsApp Business API</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp-api-key" className="text-dark-blue font-medium dark:text-white">
                    API Key
                  </Label>
                  <Input
                    id="whatsapp-api-key"
                    type="password"
                    placeholder="Your WhatsApp API key"
                    value={whatsappConfig.apiKey}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, apiKey: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp-api-secret" className="text-dark-blue font-medium dark:text-white">
                    API Secret
                  </Label>
                  <Input
                    id="whatsapp-api-secret"
                    type="password"
                    placeholder="Your WhatsApp API secret"
                    value={whatsappConfig.apiSecret}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, apiSecret: e.target.value})}
                    className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp-from" className="text-dark-blue font-medium dark:text-white">
                  From Number (with country code)
                </Label>
                <Input
                  id="whatsapp-from"
                  placeholder="+1234567890"
                  value={whatsappConfig.fromNumber}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, fromNumber: e.target.value})}
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-navy to-dark-blue hover:from-dark-blue hover:to-navy text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageServiceSettings;
