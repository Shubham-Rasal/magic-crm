import { NextRequest, NextResponse } from 'next/server';
import { IProduct } from '@/data/productData';

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json();
    
    if (!product) {
      return NextResponse.json({ error: 'Product data is required' }, { status: 400 });
    }
    
    // Perplexity API key from environment variables
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error('Missing Perplexity API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Prepare the prompt for Perplexity API
    const promptData = {
      name: product.name,
      description: product.description,
      features: product.features?.join(', '),
      benefits: product.benefits?.join(', '),
      targetMarket: product.targetMarket?.join(', '),
      pricing: `${product.pricing?.model || 'Not specified'}, starting at ${product.pricing?.startingAt || 'Not specified'}`,
      competitors: product.competitorAnalysis?.join('; ') || 'Not specified'
    };
    
    const prompt = `Act as an expert sales copywriter. Create a compelling sales pitch for the following product:
    
    Product Name: ${promptData.name}
    Description: ${promptData.description}
    Features: ${promptData.features}
    Benefits: ${promptData.benefits}
    Target Market: ${promptData.targetMarket}
    Pricing: ${promptData.pricing}
    Competitors: ${promptData.competitors}
    
    Generate a persuasive and concise sales pitch (about 300-500 words) that:
    1. Has a compelling headline
    2. Includes a hook/opening that grabs attention
    3. Highlights key features and benefits
    4. Addresses pain points of the target market
    5. Includes a clear value proposition
    6. Contains a call-to-action
    
    The tone should be professional but conversational, emphasizing the unique value and benefits rather than just listing features. Avoid being overly salesy or making unrealistic claims.
    
    Only return the sales pitch text itself, without any additional explanations or metadata.`;
    
    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales copywriter who creates compelling, concise sales pitches.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate sales pitch' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const salesPitch = data.choices[0].message.content.trim();
    
    return NextResponse.json({ salesPitch });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
