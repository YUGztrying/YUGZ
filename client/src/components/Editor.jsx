import { useState, useEffect } from 'react'
import Block from './Block'
import '../styles/Editor.css'

function Editor({ page, onSave }) {
  const [title, setTitle] = useState(page.title)
  const [icon, setIcon] = useState(page.icon)
  const [blocks, setBlocks] = useState(page.blocks)

  useEffect(() => {
    setTitle(page.title)
    setIcon(page.icon)
    setBlocks(page.blocks)
  }, [page])

  useEffect(() => {
    // Auto-save when blocks change
    const timeoutId = setTimeout(() => {
      onSave({
        ...page,
        title,
        icon,
        blocks
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [title, icon, blocks])

  const updateBlock = (blockId, updates) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ))
  }

  const addBlock = (afterBlockId, type = 'paragraph') => {
    const newBlock = {
      id: Date.now().toString(),
      type: type,
      content: '',
      properties: {}
    }

    const index = blocks.findIndex(b => b.id === afterBlockId)
    const newBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ]

    setBlocks(newBlocks)
    return newBlock.id
  }

  const deleteBlock = (blockId) => {
    if (blocks.length === 1) {
      // Don't delete the last block, just clear it
      setBlocks([{ ...blocks[0], content: '' }])
    } else {
      setBlocks(blocks.filter(b => b.id !== blockId))
    }
  }

  const moveBlockUp = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index > 0) {
      const newBlocks = [...blocks]
      const temp = newBlocks[index]
      newBlocks[index] = newBlocks[index - 1]
      newBlocks[index - 1] = temp
      setBlocks(newBlocks)
    }
  }

  const moveBlockDown = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks]
      const temp = newBlocks[index]
      newBlocks[index] = newBlocks[index + 1]
      newBlocks[index + 1] = temp
      setBlocks(newBlocks)
    }
  }

  return (
    <div className="editor">
      <div className="page-header">
        <input
          type="text"
          className="icon-input"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="📄"
          maxLength={2}
        />
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
        />
      </div>

      <div className="blocks-container">
        {blocks.map((block, index) => (
          <Block
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onAddBlock={addBlock}
            onDelete={deleteBlock}
            onMoveUp={moveBlockUp}
            onMoveDown={moveBlockDown}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default Editor
