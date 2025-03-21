import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_name, email } = body;

    // Forward the request to the actual API
    const response = await fetch('http://localhost:8000/add_emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_name,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in add_emails API:', error);
    return NextResponse.json(
      { error: 'Failed to submit email' },
      { status: 500 }
    );
  }
} 