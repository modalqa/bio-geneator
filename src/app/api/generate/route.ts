import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Using Node.js runtime instead of edge for better compatibility
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let timeoutId: NodeJS.Timeout | undefined;
  
  try {
    console.log('API Route: Starting bio generation...');
    
    // Validate environment variables
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL || !process.env.OPENROUTER_MODEL) {
      console.error('API Route: Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API configuration' },
        { status: 500 }
      );
    }

    const { name, profession, interests, traits, platform, style, includeEmojis, additionalInfo } = await req.json();

    // Validate required fields
    if (!profession || !interests?.length || !traits?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Generate 2 professional ${platform} bios for someone with the following details:
    ${name ? `Name: ${name}` : ''}
    Profession: ${profession}
    Interests: ${interests.join(', ')}
    Personality Traits: ${traits.join(', ')}
    Style: ${style}
    Additional Info: ${additionalInfo || 'None'}
    ${includeEmojis ? 'Please include relevant emojis' : 'Do not include emojis'}

    Requirements:
    - Make it engaging and professional
    - Optimize for ${platform}'s format and style
    - Keep it concise and impactful
    - Focus on highlighting professional achievements and personality
    ${platform === 'LinkedIn' ? '- Include industry keywords for better visibility' : ''}
    ${platform === 'Twitter/X' ? '- Keep it under 160 characters' : ''}
    ${platform === 'Instagram' ? '- Make it visually appealing with line breaks' : ''}
    `;

    console.log('API Route: Sending request to OpenRouter...');
    
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    console.log('API Route: Using URL:', process.env.OPENROUTER_API_URL);
    
    const response = await fetch(process.env.OPENROUTER_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Bio Generator',
        'Accept': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
      mode: 'cors',
      next: { revalidate: 0 },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL!, // Using environment variable for model selection
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing engaging and professional social media bios. Keep responses concise and focused on creating bios.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Slightly more creative
        max_tokens: 200, // Limit response length
        top_p: 0.9, // Maintain good quality while allowing some creativity
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route: OpenRouter API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `API Error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Route: Successfully generated bios');
    const rawContent = data.choices[0].message.content;
    console.log('Raw API response:', rawContent);

    // Mencoba mencocokkan dengan format "Bio 1:" dan "Bio 2:"
    const bioMatches = rawContent.match(/Bio \d:?\s*([\s\S]*?)(?=Bio \d:|$)/g);
    
    let generatedBios: string[];
    
    if (bioMatches && bioMatches.length >= 2) {
      // Jika format sesuai, gunakan hasil matching
      generatedBios = bioMatches
        .slice(0, 2)
        .map((bio: string) => {
          // Hapus "Bio X:" dan bersihkan teks
          return bio
            .replace(/Bio \d:?\s*/, '')
            .replace(/\*+/g, '')
            .trim();
        });
    } else {
      // Jika format tidak sesuai, split berdasarkan double newline
      generatedBios = rawContent
        .split(/\n\s*\n/)
        .filter((bio: string) => bio.trim().length > 0)
        .map((bio: string) => bio.replace(/\*+/g, '').trim())
        .slice(0, 2);
    }

    // Pastikan selalu ada 2 bio
    if (generatedBios.length === 1) {
      // Jika hanya ada 1 bio, gunakan variasi dari bio pertama
      const secondBio = generatedBios[0]
        .split('.')
        .slice(0, -1)
        .join('.')
        .trim();
      generatedBios.push(secondBio);
    }
    
    // Log hasil akhir untuk debugging
    console.log('Processed bios:', generatedBios);

    return NextResponse.json({ bios: generatedBios });
  } catch (error) {
    console.error('Bio generation error:', error);
    
    // More detailed error message
    const errorMessage = error instanceof Error 
      ? `Error: ${error.message}`
      : 'An unexpected error occurred';

    console.error('API Route: Detailed error:', {
      message: errorMessage,
      error: error
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
