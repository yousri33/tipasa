import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Airtable Info API called')
    
    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Just check if we can access the base metadata
    console.log('📤 Checking Airtable base info')
    
    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        }
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
          { error: 'Failed to access Airtable base info', details: errorJson },
          { status: 500 }
        )
      } catch (parseError) {
        // If parsing fails, return the raw error text
        return NextResponse.json(
          { error: 'Failed to access Airtable base info', details: errorText },
          { status: 500 }
        )
      }
    }

    // Parse the Airtable response
    const airtableResult = await airtableResponse.json()
    console.log('✅ Successfully accessed Airtable base info')
    
    // Define interface for Airtable table structure
    interface AirtableTable {
      id: string;
      name: string;
      // Add other properties as needed
    }

    // Return a sanitized version of the response (without sensitive info)
    return NextResponse.json(
      { 
        success: true,
        baseId: AIRTABLE_BASE_ID,
        tableCount: airtableResult.tables?.length || 0,
        tableIds: airtableResult.tables?.map((table: AirtableTable) => ({
          id: table.id,
          name: table.name
        })) || [],
        message: 'Successfully accessed Airtable base info'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Airtable Info API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}