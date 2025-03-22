import OpenAI from 'openai';
import logger from '../../utils/logger';
import { AppError } from '../../utils/errorHandler';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default system prompt for lead generation assistant
const DEFAULT_SYSTEM_PROMPT = `You are a lead generation assistant for a sales and marketing team. 
Your job is to help users generate, analyze, and work with lead data.
You can help with search queries, data analysis, and provide suggestions for lead generation strategies.
Be helpful, concise, and focus on providing actionable advice.
You have access to lead data, email campaigns, and integration with various data sources.`;

// Interface for chat message
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Generate a response from the AI chatbot
 * @param userMessage - The message from the user
 * @param conversationHistory - Previous messages in the conversation
 * @param customSystemPrompt - Optional custom system prompt
 * @returns The AI response
 */
export const generateChatResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  customSystemPrompt?: string
): Promise<string> => {
  try {
    const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;
    
    // Prepare the messages for the API call
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    logger.debug(`Sending request to OpenAI with ${messages.length} messages`);

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = response.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new AppError('Failed to generate a response from OpenAI', 500);
    }

    return assistantMessage;
  } catch (error: any) {
    logger.error('Error generating chat response from OpenAI:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle OpenAI-specific errors
    if (error.status === 429) {
      throw new AppError('OpenAI rate limit exceeded. Please try again later.', 429);
    }
    
    throw new AppError('Failed to generate AI response: ' + (error.message || 'Unknown error'), 500);
  }
};

/**
 * Generate a personalized message for a specific lead
 * @param leadData - Data about the lead
 * @param templateVariables - Variables to include in the template
 * @param templateType - The type of template (e.g., cold outreach, follow-up)
 * @returns Personalized message
 */
export const generatePersonalizedMessage = async (
  leadData: Record<string, any>,
  templateVariables: Record<string, any>,
  templateType: string
): Promise<string> => {
  try {
    const prompt = `
      Generate a personalized ${templateType} message for a lead with the following information:
      
      Name: ${leadData.firstName} ${leadData.lastName}
      Title: ${leadData.title}
      Company: ${leadData.company}
      Industry: ${leadData.industry || 'Unknown'}
      
      Additional context:
      ${JSON.stringify(templateVariables)}
      
      The message should be professional, conversational, and focused on value proposition.
      Don't use generic phrases like "I hope this email finds you well."
      Make specific references to the lead's company or industry where possible.
      Keep the message concise (3-4 paragraphs maximum).
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert in sales copywriting and personalization.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const personalizedMessage = response.choices[0]?.message?.content;
    
    if (!personalizedMessage) {
      throw new AppError('Failed to generate a personalized message', 500);
    }

    return personalizedMessage;
  } catch (error: any) {
    logger.error('Error generating personalized message:', error);
    throw new AppError('Failed to generate personalized message: ' + (error.message || 'Unknown error'), 500);
  }
};

/**
 * Analyze lead data and provide insights
 * @param leadData - Array of lead data to analyze
 * @returns Analysis and insights
 */
export const analyzeLeadData = async (
  leadData: Record<string, any>[]
): Promise<string> => {
  try {
    // Prepare a summary of the lead data
    const leadCount = leadData.length;
    const industries = new Set(leadData.map(lead => lead.industry).filter(Boolean));
    const titles = new Set(leadData.map(lead => lead.title).filter(Boolean));
    
    const prompt = `
      Analyze the following lead dataset:
      
      Total leads: ${leadCount}
      Industries: ${Array.from(industries).join(', ')}
      Job titles: ${Array.from(titles).join(', ')}
      
      Sample leads:
      ${JSON.stringify(leadData.slice(0, 5))}
      
      Provide insights on:
      1. The quality of the leads based on job titles and industries
      2. Suggested approaches for outreach based on the data
      3. Any patterns or opportunities you notice in the dataset
      4. Recommendations for improving lead quality or targeting
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert in lead generation and sales analytics.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const analysis = response.choices[0]?.message?.content;
    
    if (!analysis) {
      throw new AppError('Failed to generate lead data analysis', 500);
    }

    return analysis;
  } catch (error: any) {
    logger.error('Error analyzing lead data:', error);
    throw new AppError('Failed to analyze lead data: ' + (error.message || 'Unknown error'), 500);
  }
};

/**
 * Generate a search query for lead generation
 * @param naturalLanguageQuery - Natural language description of the desired leads
 * @returns Structured query for lead generation
 */
export const generateSearchQuery = async (
  naturalLanguageQuery: string
): Promise<Record<string, any>> => {
  try {
    const prompt = `
      Convert the following natural language query into a structured JSON search query for lead generation:
      
      Query: "${naturalLanguageQuery}"
      
      The JSON should include relevant fields such as:
      - job titles (array of strings)
      - industries (array of strings)
      - company sizes (min/max employee count)
      - locations (array of regions, countries, or cities)
      - keywords (array of relevant keywords)
      - exclusions (things to exclude)
      
      Only include fields that are explicitly or implicitly mentioned in the query.
      Format the response as valid JSON without any additional text.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert in converting natural language to structured data.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    });

    const queryJson = response.choices[0]?.message?.content;
    
    if (!queryJson) {
      throw new AppError('Failed to generate search query', 500);
    }

    return JSON.parse(queryJson);
  } catch (error: any) {
    logger.error('Error generating search query:', error);
    
    if (error instanceof SyntaxError) {
      throw new AppError('Failed to parse JSON response from OpenAI', 500);
    }
    
    throw new AppError('Failed to generate search query: ' + (error.message || 'Unknown error'), 500);
  }
};

export default {
  generateChatResponse,
  generatePersonalizedMessage,
  analyzeLeadData,
  generateSearchQuery
};