import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'

// Define the type for our database structure
type Stats = {
  totalBiosGenerated: number
  lastGeneratedDate: string | null
  platformStats: {
    [key: string]: number
  }
}

// Default data
const defaultData: Stats = {
  totalBiosGenerated: 0,
  lastGeneratedDate: null,
  platformStats: {}
}

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

// Configure lowdb to write to JSON file
const adapter = new JSONFile<Stats>(path.join(dataDir, 'stats.json'))
const db = new Low<Stats>(adapter, defaultData)

// Initialize the database
export const initDB = async () => {
  await db.read()
  db.data = db.data || defaultData
  await db.write()
}

// Get all stats
export const getStats = async () => {
  await db.read()
  return db.data
}

// Update bio generation stats
export const updateBioStats = async (platform: string) => {
  await db.read()
  
  // Increment total bios generated
  db.data.totalBiosGenerated += 1
  
  // Update last generated date
  db.data.lastGeneratedDate = new Date().toISOString()
  
  // Update platform stats
  db.data.platformStats[platform] = (db.data.platformStats[platform] || 0) + 1
  
  await db.write()
  return db.data
}

// Reset stats (useful for testing or if needed)
export const resetStats = async () => {
  db.data = { ...defaultData }
  await db.write()
  return db.data
}

// Initialize the database when this module is imported
initDB().catch(console.error)
