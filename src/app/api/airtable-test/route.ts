import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.NEXT_PUBLIC_ORDERS_TABLE_ID // Order Details table

export async function GET() {
  try {
    console.log('🧪 Airtable Test API called')
    
    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Simple test data with valid Order Status value
    const testData = {
      fields: {
        'Customer Name': 'Test User',
        'Phone Number': '0123456789',
        // Using a likely valid status value
        'Order Status': 'Pending'
      }
    }
    
    console.log('📤 Sending test data to Airtable:', JSON.stringify(testData, null, 2))
    
    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      }
    )
    
    console.log('📥 Airtable response status:', airtableResponse.status)

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text()
      console.error('Airtable API error:', errorText)
      try {
        // Try to parse the error as JSON for more detailed error reporting
        const errorJson = JSON.parse(errorText)
        console.error('Airtable API error details:', errorJson)
        return NextResponse.json(
          { error: 'Failed to create test record in Airtable', details: errorJson },
          { status: 500 }
        )
      } catch {
        // If parsing fails, return the raw error text
        return NextResponse.json(
          { error: 'Failed to create test record in Airtable', details: errorText },
          { status: 500 }
        )
      }
    }

    // Parse the Airtable response to get the record ID
    const airtableResult = await airtableResponse.json()
    const recordId = airtableResult?.id || 'unknown'
    console.log('✅ Test record created successfully in Airtable:', recordId)
    
    return NextResponse.json(
      { 
        success: true, 
        recordId: recordId,
        message: 'Test record created successfully'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Airtable Test API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}