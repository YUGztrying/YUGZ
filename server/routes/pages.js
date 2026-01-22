import express from 'express'
import Page from '../models/Page.js'

const router = express.Router()

// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 })
    res.json(pages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single page
router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }
    res.json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new page
router.post('/', async (req, res) => {
  const page = new Page({
    title: req.body.title || 'Untitled',
    icon: req.body.icon || '📄',
    blocks: req.body.blocks || [{
      id: Date.now().toString(),
      type: 'paragraph',
      content: '',
      properties: {}
    }]
  })

  try {
    const newPage = await page.save()
    res.status(201).json(newPage)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update page
router.put('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }

    if (req.body.title != null) {
      page.title = req.body.title
    }
    if (req.body.icon != null) {
      page.icon = req.body.icon
    }
    if (req.body.blocks != null) {
      page.blocks = req.body.blocks
    }

    const updatedPage = await page.save()
    res.json(updatedPage)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete page
router.delete('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }

    await page.deleteOne()
    res.json({ message: 'Page deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
