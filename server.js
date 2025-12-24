// Simple Express server to handle driver data persistence
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const DRIVERS_FILE_PATH = path.join(
  __dirname,
  'src',
  'shared',
  'data',
  'driversData.js',
)

// API endpoint to add a new driver to driversData.js
app.post('/api/drivers', async (req, res) => {
  try {
    const newDriver = req.body

    if (!newDriver || !newDriver.id) {
      return res.status(400).json({ error: 'Driver data with ID is required' })
    }

    // Read the current driversData.js file
    const fileContent = await fs.readFile(DRIVERS_FILE_PATH, 'utf-8')

    // Find the export const drivers = [ ... ] array
    const exportMatch = fileContent.match(
      /export const drivers = \[([\s\S]*?)\n\]/,
    )

    if (!exportMatch) {
      return res
        .status(500)
        .json({ error: 'Could not parse driversData.js file' })
    }

    // Convert the new driver object to a formatted string
    const driverString = JSON.stringify(newDriver, null, 2)
      .split('\n')
      .map((line, index) => (index === 0 ? `  ${line}` : `  ${line}`))
      .join('\n')

    // Insert the new driver at the end of the array
    const updatedContent = fileContent.replace(
      /export const drivers = \[([\s\S]*?)\n\]/,
      (match, content) => {
        // Add comma after last driver if content is not empty
        const hasDrivers = content.trim().length > 0
        const separator = hasDrivers ? ',' : ''
        return `export const drivers = [${content}${separator}\n${driverString}\n]`
      },
    )

    // Write the updated content back to the file
    await fs.writeFile(DRIVERS_FILE_PATH, updatedContent, 'utf-8')

    res.json({ success: true, message: 'Driver added successfully' })
  } catch (error) {
    console.error('Error adding driver:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Driver API server running on http://localhost:${PORT}`)
})
