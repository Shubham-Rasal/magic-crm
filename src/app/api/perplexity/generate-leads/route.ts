import { NextRequest, NextResponse } from 'next/server';
import { IProduct, IProductLead } from '@/data/productData';

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
      targetMarket: product.targetMarket?.join(', '),
      industry: product.industry || 'Not specified'
    };
    
    const prompt = `Act as a lead generation specialist for B2B sales. Based on the following product information, generate 10 realistic potential leads (companies and individuals) that would be ideal targets for this product:
    
    Product Name: ${promptData.name}
    Description: ${promptData.description}
    Target Market: ${promptData.targetMarket}
    
    For each lead, provide the following information in a structured JSON format:
    1. fullName: A realistic name for a decision-maker at the company
    2. email: Their business email (firstname.lastname@company.com format)
    3. companyName: The company name
    4. jobTitle: Their job title (must be a decision-maker relevant to the product)
    5. location: City, Country
    6. leadScore: A number between 50-100 representing the lead quality
    7. buyerIntentSignals: "High", "Medium", or "Low"
    8. notes: A brief note on why this lead might be interested
    9. linkedinUrl: A fictional but realistic LinkedIn URL
    10. matchReason: Why this lead is a good match for the product
    
    Return your answer ONLY as a valid JSON array containing 10 lead objects, nothing else. Format:
    [
      {
        "fullName": "...",
        "email": "...",
        "companyName": "...",
        "jobTitle": "...",
        "location": "...",
        "leadScore": 85,
        "buyerIntentSignals": "High",
        "notes": "...",
        "linkedinUrl": "...",
        "matchReason": "..."
      },
      ...
    ]
    
    Ensure all data is realistic but fictional, with diverse companies that truly match the target market, varying lead scores, and thoughtful match reasons.`;
    
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
            content: 'You are a lead generation specialist who creates realistic, targeted sales leads in structured JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate leads' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract the JSON from the response
    try {
      // Try to parse the JSON from the response
      // It might be embedded in markdown code blocks or have extra text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const leadsData = JSON.parse(jsonString);
        
        // Create complete lead objects with IDs and productId
        const completedLeads: IProductLead[] = leadsData.map((lead: any) => ({
          id: crypto.randomUUID(),
          productId: product.id,
          fullName: lead.fullName,
          email: lead.email,
          companyName: lead.companyName,
          jobTitle: lead.jobTitle,
          location: lead.location,
          leadScore: lead.leadScore,
          buyerIntentSignals: lead.buyerIntentSignals,
          notes: lead.notes,
          lastContacted: null,
          followUpDate: null,
          engagementStatus: 'New Lead',
          linkedinUrl: lead.linkedinUrl,
          matchReason: lead.matchReason
        }));
        
        // Save leads to localStorage (this would be in a database in a real app)
        // For now we'll return them to be saved on the client
        return NextResponse.json({ leads: completedLeads });
      } else {
        return NextResponse.json(
          { error: 'Failed to parse leads data' },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error parsing Perplexity response:', error);
      return NextResponse.json(
        { error: 'Failed to parse leads data' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
