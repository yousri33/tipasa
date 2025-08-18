import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.NEXT_PUBLIC_ORDERS_TABLE_ID // Order Details table

interface OrderData {
  customerName: string
  phoneNumber: string
  wilaya: string
  commune: string
  deliveryType: 'home' | 'bureau'
  productName: string
  productPrice: number
  productId: string
  size: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Order API called - Fixed version')
    
    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const orderData: OrderData = await request.json()
    console.log('📦 Order data received:', orderData)

    // Validate required fields
    const requiredFields = ['customerName', 'phoneNumber', 'wilaya', 'commune', 'deliveryType', 'productName', 'productPrice', 'productId', 'size']
    for (const field of requiredFields) {
      if (!orderData[field as keyof OrderData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Enhanced logging for debugging size-related issues
    console.log('🔍 Size value being sent:', orderData.size)
    console.log('🔍 Size value type:', typeof orderData.size)
    console.log('🔍 Full order data:', JSON.stringify(orderData, null, 2))
    
    // Ensure size is a simple string that Airtable can accept
    let sizeValue = '';
    if (Array.isArray(orderData.size)) {
      // If it's an array, take the first value
      sizeValue = orderData.size[0]?.toString() || '';
    } else if (orderData.size) {
      // If it's not an array but exists, convert to string
      sizeValue = orderData.size.toString();
    }
    
    console.log('🔍 Normalized size value:', sizeValue);
    
    // Prepare data for Airtable with the normalized size value
    const airtableData = {
      fields: {
        'Customer Name': orderData.customerName,
        'Phone Number': orderData.phoneNumber,
        'Wilaya': orderData.wilaya,
        'Commune': orderData.commune,
        'Delivery Type': orderData.deliveryType === 'home' ? 'Home Delivery' : 'Bureau (Office/Pickup Point)',
        // Use product ID as array for linked record field - field name is 'Product Name' in Airtable
        'Product Name': [orderData.productId],
        // IMPORTANT: The field name in Airtable is case-sensitive
        // If you get an UNKNOWN_FIELD_NAME error, check the exact field name in Airtable
        'size': sizeValue, // Using our normalized string value - lowercase in Airtable
        'Order Date': new Date().toISOString(),
        'Order Status': 'New Order'
        // Note: Total Amount is calculated via lookup in Airtable
      }
    }
    
    // Double-check that we're using lowercase 'size', not 'Size'
    console.log('🔍 Final Airtable data:', JSON.stringify(airtableData, null, 2))
    
    console.log('📤 Sending to Airtable:', JSON.stringify(airtableData, null, 2))
    
    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtableData),
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
          { error: 'Failed to create order in Airtable', details: errorJson },
          { status: 500 }
        )
      } catch (parseError) {
        // If parsing fails, return the raw error text
        return NextResponse.json(
          { error: 'Failed to create order in Airtable', details: errorText },
          { status: 500 }
        )
      }
    }

    // Parse the Airtable response to get the record ID
    const airtableResult = await airtableResponse.json()
    const orderId = airtableResult?.id || Math.random().toString(36).substr(2, 9).toUpperCase()
    console.log('✅ Order created successfully in Airtable:', orderId)
    
    return NextResponse.json(
      { 
        success: true, 
        orderId: orderId,
        message: 'Order created successfully'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}