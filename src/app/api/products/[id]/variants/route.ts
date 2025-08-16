import { NextRequest, NextResponse } from 'next/server'

// This is a placeholder API route for product variants
// Since we're not using variants in the current implementation,
// we'll return a simple response to prevent 404 errors

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔍 Variants API called')
    console.log('📦 Product ID:', id)
    
    // For now, return empty variants array since we're not using variants
    // This prevents the 404 error that was causing issues
    return NextResponse.json({
      success: true,
      variants: [],
      message: 'Variants feature not implemented yet'
    })
    
  } catch (error) {
    console.error('❌ Error in variants API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch variants',
        variants: []
      },
      { status: 500 }
    )
  }
}