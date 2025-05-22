import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { companyName } = await req.json();
    
    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
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
    const prompt = `Act as a business intelligence expert. I need detailed information about a company called "${companyName}". 
    Research and provide me with the following information in a structured JSON format (and nothing else):
    
    1. websiteUrl: The company's official website URL (if available)
    2. location: The company's headquarters location (city, country)
    3. companySize: Employee count range (1-10, 11-50, 51-200, 201-500, or 500+)
    4. industry: Primary industry the company operates in
    5. geographicalMarkets: An array of geographical markets the company operates in (e.g., ["North America", "Europe"])
    6. visionStatement: The company's vision statement if available
    7. coreValues: The company's core values if available
    8. marketPositioning: How the company positions itself in the market (Premium, Mid-market, Budget, Luxury, Value, Innovative, or Niche)
    9. primarySalesChannels: An array of the company's primary sales channels (e.g., ["Direct Sales", "E-commerce"])
    10. partnerships: Information about the company's strategic partnerships if available
    
    If any information is not available, provide an empty string for text fields or an empty array for array fields.
    Respond only with valid JSON data in the following format:
    {
      "websiteUrl": "",
      "location": "",
      "companySize": "",
      "industry": "",
      "geographicalMarkets": [],
      "visionStatement": "",
      "coreValues": "",
      "marketPositioning": "",
      "primarySalesChannels": [],
      "partnerships": ""
    }`;
    
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
            content: 'You are a helpful assistant that provides accurate company information structured as JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
      })
    });
    console.log('Perplexity API response:', response);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch company data' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Extract the JSON from the response
    try {
      const content = data.choices[0].message.content;
      // Try to parse the JSON from the response
      // It might be embedded in markdown code blocks or have extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const companyData = JSON.parse(jsonString);
        return NextResponse.json(companyData);
      } else {
        // Fallback in case the JSON isn't properly structured
        return NextResponse.json({
          websiteUrl: "",
          location: "",
          companySize: "1-10",
          industry: "Technology",
          geographicalMarkets: [],
          visionStatement: "",
          coreValues: "",
          marketPositioning: "",
          primarySalesChannels: [],
          partnerships: ""
        });
      }
    } catch (error) {
      console.error('Error parsing Perplexity response:', error);
      return NextResponse.json(
        { error: 'Failed to parse company data' },
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
