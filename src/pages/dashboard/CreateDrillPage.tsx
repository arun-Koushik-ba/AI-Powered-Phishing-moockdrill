
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drill, ChevronRight, CheckCircle } from 'lucide-react';
import TargetInformationForm, { TargetInformation } from '@/components/TargetInformationForm';
import EmailPreview from '@/components/EmailPreview';
import DeliveryMethod from '@/components/DeliveryMethod';

type DrillStage = 'target-info' | 'email-preview' | 'delivery';

const CreateDrillPage = () => {
  const [currentStage, setCurrentStage] = useState<DrillStage>('target-info');
  const [targetData, setTargetData] = useState<TargetInformation | null>(null);
  const [emailContent, setEmailContent] = useState<string>('');
  const [completedStages, setCompletedStages] = useState<DrillStage[]>([]);

  const handleTargetSubmit = (data: TargetInformation) => {
    setTargetData(data);
    setCurrentStage('email-preview');
    setCompletedStages(prev => [...prev, 'target-info']);
  };

  const handleEmailAccept = (content: string) => {
    setEmailContent(content);
    setCurrentStage('delivery');
    setCompletedStages(prev => [...prev, 'email-preview']);
  };

  const handleEmailSuggestion = (suggestion: string) => {
    console.log('Will regenerate email with suggestion:', suggestion);
  };

  const handleGoBack = () => {
    if (currentStage === 'email-preview') {
      setCurrentStage('target-info');
      setCompletedStages([]);
    } else if (currentStage === 'delivery') {
      setCurrentStage('email-preview');
      setCompletedStages(['target-info']);
    }
  };

  const handleSendComplete = () => {
    setCompletedStages(prev => [...prev, 'delivery']);
    // Reset for new drill
    setTimeout(() => {
      setCurrentStage('target-info');
      setTargetData(null);
      setEmailContent('');
      setCompletedStages([]);
    }, 3000);
  };

  const stages = [
    { id: 'target-info', title: 'Target Profile', description: 'Collect target details' },
    { id: 'email-preview', title: 'Email Generation', description: 'Review & refine draft email' },
    { id: 'delivery', title: 'Send Security Drill', description: 'Choose delivery method & send' }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal to-navy rounded-lg flex items-center justify-center">
              <Drill className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-navy dark:text-white">Create Security Drill</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Professional phishing simulation for enhanced security awareness training
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    completedStages.includes(stage.id as DrillStage)
                      ? 'bg-green-600 border-green-600 text-white'
                      : currentStage === stage.id
                      ? 'bg-teal border-teal text-white'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}>
                    {completedStages.includes(stage.id as DrillStage) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${
                      currentStage === stage.id || completedStages.includes(stage.id as DrillStage)
                        ? 'text-navy dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {stage.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stage.description}</p>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stage Content */}
      {currentStage === 'target-info' && (
        <TargetInformationForm onSubmit={handleTargetSubmit} />
      )}

      {currentStage === 'email-preview' && targetData && (
        <EmailPreview
          targetData={targetData}
          onAccept={handleEmailAccept}
          onSuggestion={handleEmailSuggestion}
          onGoBack={handleGoBack}
        />
      )}

      {currentStage === 'delivery' && emailContent && (
        <DeliveryMethod
          emailContent={emailContent}
          onSend={handleSendComplete}
          onGoBack={handleGoBack}
        />
      )}
    </div>
  );
};

export default CreateDrillPage;
