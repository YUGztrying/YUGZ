import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import pagesRouter from './routes/pages.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/pages', pagesRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error)
    console.log('Note: Make sure MongoDB is installed and running')
    console.log('To use without MongoDB, the app will use localStorage in the browser')
    // Start server anyway for localStorage mode
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} (MongoDB not connected - using localStorage mode)`)
    })
  })

export default app
