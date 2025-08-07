
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Edit, Check, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { TargetInformation } from './TargetInformationForm';
import { useToast } from '@/hooks/use-toast';
import { geminiService } from '@/utils/gemini';
import { storage } from '@/utils/storage';

interface EmailPreviewProps {
  targetData: TargetInformation;
  onAccept: (emailContent: string) => void;
  onSuggestion: (suggestion: string) => void;
  onGoBack: () => void;
}

const EmailPreview = ({ targetData, onAccept, onSuggestion, onGoBack }: EmailPreviewProps) => {
  const [suggestion, setSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailContent, setEmailContent] = useState({ subject: '', body: '', scamLink: '' });
  const { toast } = useToast();

  useEffect(() => {
    // Auto-generate email when component mounts if API key is available
    const settings = storage.getSettings();
    if (settings.geminiApiKey) {
      generateEmailWithAI();
    }
  }, []);

  const generateScamLink = () => {
    const domains = ['secure-verify', 'account-update', 'security-check', 'verify-now', 'urgent-action'];
    const extensions = ['com', 'net', 'org'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomExt = extensions[Math.floor(Math.random() * extensions.length)];
    const randomId = Math.random().toString(36).substring(7);
    return `https://${randomDomain}-${randomId}.${randomExt}/verify`;
  };

  const generateEmailWithAI = async (userSuggestion?: string) => {
    const settings = storage.getSettings();
    if (!settings.geminiApiKey) {
      toast({
        title: "Gemini API Key Required",
        description: "Please configure your Gemini API key in Account Settings first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const emailData = await geminiService.generatePhishingEmail(targetData, userSuggestion);
      const scamLink = generateScamLink();
      
      setEmailContent({
        subject: emailData.subject,
        body: emailData.body.replace('[SCAM_LINK]', scamLink),
        scamLink: scamLink
      });

      toast({
        title: "Email Generated",
        description: "Gemini AI has generated a personalized phishing email.",
        className: "bg-green-600 text-white"
      });

    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate email. Please check your Gemini API key in Account Settings.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Remove the useEffect that automatically triggers generation
  // useEffect(() => {
  //   if (apiKey) {
  //     generateEmailWithAI();
  //   }
  // }, [apiKey]);

  const handleSuggestion = () => {
    if (!suggestion.trim()) return;
    generateEmailWithAI(suggestion);
    setSuggestion('');
  };

  const handleAccept = () => {
    if (!emailContent.body) {
      toast({
        title: "No Email Generated",
        description: "Please generate an email first.",
        variant: "destructive"
      });
      return;
    }
    onAccept(emailContent.body + '\n\nScam Link: ' + emailContent.scamLink);
  };

  return (
    <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-navy dark:text-white">AI-Generated Phishing Email</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Review the generated mock drill email and provide feedback or accept
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Status */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          {storage.getSettings().geminiApiKey ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-900 dark:text-blue-200 font-medium">✓ Gemini API Configured</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Ready to generate AI-powered phishing emails</p>
              </div>
              <Button 
                onClick={() => generateEmailWithAI()}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-orange-900 dark:text-orange-200 font-medium">⚠ Gemini API Key Required</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                Please configure your Gemini API key in Account Settings to generate emails.
              </p>
              <Button 
                onClick={() => generateEmailWithAI()}
                disabled={true}
                variant="outline"
                className="text-orange-700 border-orange-300"
              >
                Configure API Key First
              </Button>
            </div>
          )}
        </div>

        {/* Target Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Target Profile Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-300">
            <p><strong>Name:</strong> {targetData.name}</p>
            <p><strong>Department:</strong> {targetData.department}</p>
            <p><strong>Location:</strong> {targetData.city}</p>
            <p><strong>Age:</strong> {targetData.age}</p>
          </div>
        </div>

        {/* Email Preview */}
        {emailContent.subject && (
          <div className="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              <h4 className="font-semibold text-orange-900 dark:text-orange-200">Mock Phishing Email Preview</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
                <p className="font-semibold bg-white dark:bg-gray-700 p-2 rounded border text-gray-900 dark:text-white">
                  {emailContent.subject}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Body:</label>
                <div className="bg-white dark:bg-gray-700 p-4 rounded border text-gray-900 dark:text-white whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                  {emailContent.body}
                </div>
              </div>

              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  🚨 Scam Link: <code className="bg-red-200 dark:bg-red-800 px-2 py-1 rounded">{emailContent.scamLink}</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Box */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Provide suggestions to improve the email:
          </label>
          <Textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="e.g., Make it more urgent, add more personal details, change the scenario..."
            className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleSuggestion}
            disabled={!suggestion.trim() || isGenerating}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Apply Suggestion
              </>
            )}
          </Button>
          
          <Button
            onClick={handleAccept}
            disabled={!emailContent.body}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
