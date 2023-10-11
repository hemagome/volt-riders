import { db } from '@/lib/turso'
import { eps } from '@/lib/schema'
import { NextResponse } from 'next/server'

export const GET = async () => {
	// const data = await db.select().from(eps).all()
	return NextResponse.json(await db.select().from(eps).all())
}