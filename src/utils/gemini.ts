
// Gemini API integration for generating phishing emails
import { storage } from './storage';

export interface GeminiResponse {
  subject: string;
  body: string;
}

export const geminiService = {
  async generatePhishingEmail(targetData: any, userSuggestion?: string): Promise<GeminiResponse> {
    const settings = storage.getSettings();
    const apiKey = settings.geminiApiKey;

    if (!apiKey) {
      throw new Error('Gemini API key not found. Please configure it in Account Settings.');
    }

    const prompt = `You are a creative security professional that generates realistic phishing/scam emails for cybersecurity training. Create a UNIQUE and PERSONALIZED scam email based on the target's profile.

    TARGET PROFILE:
    Name: ${targetData.name}
    Age: ${targetData.age}
    Gender: ${targetData.gender}
    Department: ${targetData.department}
    City: ${targetData.city}
    Date of Birth: ${targetData.dob}
    Hobbies: ${targetData.hobbies}
    Family Info: ${targetData.familyInfo}
    Social Info: ${targetData.socialInfo}
    Employee History: ${targetData.employeeHistory}
    Additional Info: ${targetData.additionalInfo}
    
    ${userSuggestion ? `SPECIAL REQUEST: ${userSuggestion}` : ''}
    
    CRITICAL GREETING REQUIREMENT:
    - The email MUST start with "Dear ${targetData.name}," - use their EXACT name, not "Dear User" or "Dear Customer"
    - This is mandatory and non-negotiable
    
    CREATIVE INSTRUCTIONS:
    1. Analyze the target's profile including their EMPLOYEE HISTORY and create a STORY/SCENARIO that would appeal to THEM specifically
    2. Use their work experience, department, location, hobbies, or family situation to craft a believable scenario
    3. Leverage their professional background and skills mentioned in employee history for more targeted attacks
    4. Make each email COMPLETELY DIFFERENT - vary the scam type, tone, urgency level, and approach
    5. Create realistic backstories and context that match their professional and personal profile
    
    SCAM SCENARIOS TO VARY BETWEEN:
    - Work-related: IT security updates, HR policy changes, salary/bonus notifications, professional development opportunities
    - Career-focused: Job opportunities, certification renewals, professional memberships, industry conferences
    - Banking/Financial: Account verification, suspicious activity alerts, payment confirmations
    - Government: Tax refunds, professional license renewals, compliance requirements
    - Personal: Prize winnings, insurance claims, utility bills, subscription renewals
    - Social: Professional networking, industry events, colleague recommendations
    - Location-based: Local business services, city-specific professional services
    - Skill-based: Training opportunities, software updates, tool subscriptions relevant to their background
    
    PERSONALIZATION EXAMPLES USING EMPLOYEE HISTORY:
    - If they're experienced in IT: "Critical security patch required for systems you manage"
    - If they have finance background: "Urgent: New compliance requirements for financial professionals"
    - If they have certifications: "Your professional certification expires soon - renew now"
    - If they're in management: "New leadership training opportunity - limited seats"
    - If they have technical skills: "Software license renewal required for [specific tool]"
    - If they're new to role: "Welcome package and onboarding materials ready"
    
    CREATIVE STORYTELLING RULES:
    1. NEVER repeat the same scenario twice - be creative and unique each time
    2. MUST start with "Dear ${targetData.name}," - this is mandatory
    3. Create believable urgency relevant to their professional situation
    4. Include realistic details that match their work background and experience level
    5. Add authentic-sounding contact details using realistic formats like:
       - Phone numbers: +1 (555) 123-4567, +44 20 7123 4567, +91 98765 43210
       - Email addresses: support@company-name.com, noreply@service-name.org, security@platform-name.net
    6. Use [SCAM_LINK] placeholder for the malicious link
    7. Make the language professional but with subtle scam indicators
    8. Create emotional hooks relevant to their career stage and personal situation
    9. Vary the sender identity (companies, services, professional bodies, training organizations)
    10. Include time pressure that feels realistic for their professional context
    11. NEVER use the word "fake" or any variations - use realistic placeholder information instead
    12. Use realistic company names, service names, and contact information
    
    TONE VARIATIONS:
    - Sometimes urgent and professional
    - Sometimes helpful and informative
    - Sometimes exciting (opportunities, advancement)
    - Sometimes official and bureaucratic
    - Always convincing for someone with their background and experience level
    
    Make the email feel like it was specifically crafted for this person based on their professional history and personal information. Tell a story that connects to their work experience and current role.
    
    Respond with ONLY a JSON object:
    {
      "subject": "Professional subject line relevant to their work background and situation",
      "body": "Personalized email body starting with 'Dear ${targetData.name},' and incorporating their employee history and professional context with [SCAM_LINK] placeholder"
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1500,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini API');
      }

      const emailData = JSON.parse(jsonMatch[0]);
      return {
        subject: emailData.subject,
        body: emailData.body
      };

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate email with Gemini API');
    }
  },

  validateApiKey(apiKey: string): boolean {
    // Basic validation - check if it looks like a Gemini API key
    return apiKey.startsWith('AIza') && apiKey.length > 30;
  }
};
