import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = 'appkv5ziCdUs8gXzV'
const AIRTABLE_TABLE_ID = 'tblcpGGr9FW0EOaDE' // Order Details table

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
    if (!AIRTABLE_API_KEY) {
      console.error('AIRTABLE_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const orderData: OrderData = await request.json()

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

    // Prepare data for Airtable
    const airtableData = {
      fields: {
        'Customer Name': orderData.customerName,
        'Phone Number': orderData.phoneNumber,
        'Wilaya': orderData.wilaya,
        'Commune': orderData.commune,
        'Delivery Type': orderData.deliveryType === 'home' ? 'Home Delivery' : 'Bureau (Office/Pickup Point)',
        'Product Name': [orderData.productId], // Array of record IDs for linked records
        'size': orderData.size,
        'Order Date': new Date().toISOString(),
        'Order Status': 'New Order'
      }
    }

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

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text()
      console.error('Airtable API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to create order in Airtable' },
        { status: 500 }
      )
    }

    const airtableResult = await airtableResponse.json()
    
    return NextResponse.json(
      { 
        success: true, 
        orderId: airtableResult.id,
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