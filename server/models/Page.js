import mongoose from 'mongoose'

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['paragraph', 'heading1', 'heading2', 'heading3', 'bulletList', 'numberList', 'todo', 'code', 'quote'],
    default: 'paragraph'
  },
  content: { type: String, default: '' },
  properties: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
})

const pageSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled' },
  icon: { type: String, default: '📄' },
  blocks: [blockSchema],
  parentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

pageSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('Page', pageSchema)
