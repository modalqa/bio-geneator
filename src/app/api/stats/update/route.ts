import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateBioStats } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { platform } = await req.json()
    
    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    const updatedStats = await updateBioStats(platform)
    return NextResponse.json(updatedStats)
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}
