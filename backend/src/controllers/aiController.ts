import { Request, Response } from 'express';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

// @desc    Analyze student profile or resume using Groq AI
// @route   POST /api/ai/analyze-student
// @access  Private
export const analyzeStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skills, github, name, goal } = req.body;
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy_key') {
      res.status(500).json({ message: 'GROQ_API_KEY is not configured in the environment variables.' });
      return;
    }

    const prompt = `Act as an expert career counselor and technical recruiter. 
    Analyze the following student profile and provide a concise, encouraging 3-paragraph summary:
    1. Overall strengths based on their skills (${skills?.join(', ') || 'None listed'}).
    2. Areas for improvement or recommended next skills to learn based on industry trends.
    3. How their Github profile (${github || 'Not provided'}) reflects their capabilities.
    Student Name: ${name || 'Student'}
    Student Goal: ${goal || 'Software Engineering placement'}
    Make it professional and inspiring.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768', 
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'No analysis could be generated.';

    res.json({ analysis: aiResponse });
  } catch (error: any) {
    console.error('Groq AI Error:', error);
    res.status(500).json({ message: 'Error generating AI analysis', error: error.message });
  }
};
