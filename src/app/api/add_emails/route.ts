import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_name, email } = body;

    // Forward the request to the actual API
    const response = await fetch('http://13.57.40.112:8000/api/add_emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "project_name": project_name,
        "email": email,
      }),
    });

    const responseData = await response.json();

    if (response.status === 200) {
      return NextResponse.json({ success: true });
    } else if (response.status === 422) {
      return NextResponse.json(
        { error: responseData.detail || 'Invalid email format' },
        { status: 422 }
      );
    } else {
      throw new Error('Failed to submit email');
    }
  } catch (error) {
    console.error('Error in add_emails API:', error);
    return NextResponse.json(
      { error: 'Failed to submit email' },
      { status: 500 }
    );
  }
} 