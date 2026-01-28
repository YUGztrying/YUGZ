import { useState, useRef } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import '../styles/TableBlock.css'

function TableBlock({ block, onUpdate }) {
  const [resizing, setResizing] = useState(null)
  const tableRef = useRef(null)
  const resizeStartRef = useRef({ width: 0, startX: 0, colIndex: 0 })

  // Initialize table if not exists
  const initTable = () => {
    if (!block.properties?.table) {
      onUpdate(block.id, {
        properties: {
          table: {
            columns: [
              { id: '1', width: 200, header: 'Column 1' },
              { id: '2', width: 200, header: 'Column 2' },
              { id: '3', width: 200, header: 'Column 3' }
            ],
            rows: [
              { id: '1', cells: { '1': '', '2': '', '3': '' } },
              { id: '2', cells: { '1': '', '2': '', '3': '' } }
            ]
          }
        }
      })
    }
  }

  const table = block.properties?.table || { columns: [], rows: [] }

  if (!block.properties?.table) {
    initTable()
    return null
  }

  const handleCellChange = (rowId, colId, value) => {
    const updatedRows = table.rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          cells: { ...row.cells, [colId]: value }
        }
      }
      return row
    })

    onUpdate(block.id, {
      properties: {
        table: { ...table, rows: updatedRows }
      }
    })
  }

  const handleHeaderChange = (colId, value) => {
    const updatedColumns = table.columns.map(col =>
      col.id === colId ? { ...col, header: value } : col
    )

    onUpdate(block.id, {
      properties: {
        table: { ...table, columns: updatedColumns }
      }
    })
  }

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
      cells: {}
    }
    table.columns.forEach(col => {
      newRow.cells[col.id] = ''
    })

    onUpdate(block.id, {
      properties: {
        table: { ...table, rows: [...table.rows, newRow] }
      }
    })
  }

  const addColumn = () => {
    const newCol = {
      id: Date.now().toString(),
      width: 200,
      header: `Column ${table.columns.length + 1}`
    }

    const updatedRows = table.rows.map(row => ({
      ...row,
      cells: { ...row.cells, [newCol.id]: '' }
    }))

    onUpdate(block.id, {
      properties: {
        table: {
          columns: [...table.columns, newCol],
          rows: updatedRows
        }
      }
    })
  }

  const deleteRow = (rowId) => {
    if (table.rows.length <= 1) return

    onUpdate(block.id, {
      properties: {
        table: {
          ...table,
          rows: table.rows.filter(row => row.id !== rowId)
        }
      }
    })
  }

  const deleteColumn = (colId) => {
    if (table.columns.length <= 1) return

    const updatedRows = table.rows.map(row => {
      const newCells = { ...row.cells }
      delete newCells[colId]
      return { ...row, cells: newCells }
    })

    onUpdate(block.id, {
      properties: {
        table: {
          columns: table.columns.filter(col => col.id !== colId),
          rows: updatedRows
        }
      }
    })
  }

  const handleResizeStart = (e, colIndex) => {
    e.preventDefault()
    setResizing(colIndex)
    resizeStartRef.current = {
      width: table.columns[colIndex].width,
      startX: e.clientX,
      colIndex
    }
  }

  const handleResizeMove = (e) => {
    if (resizing === null) return

    const deltaX = e.clientX - resizeStartRef.current.startX
    const newWidth = Math.max(100, resizeStartRef.current.width + deltaX)

    const updatedColumns = [...table.columns]
    updatedColumns[resizing] = {
      ...updatedColumns[resizing],
      width: newWidth
    }

    onUpdate(block.id, {
      properties: {
        table: { ...table, columns: updatedColumns }
      }
    })
  }

  const handleResizeEnd = () => {
    setResizing(null)
  }

  return (
    <div
      className="table-block-container"
      onMouseMove={handleResizeMove}
      onMouseUp={handleResizeEnd}
      onMouseLeave={handleResizeEnd}
    >
      <div className="table-wrapper" ref={tableRef}>
        <table className="editable-table">
          <thead>
            <tr>
              {table.columns.map((col, colIndex) => (
                <th key={col.id} style={{ width: col.width }}>
                  <div className="table-header-cell">
                    <input
                      type="text"
                      value={col.header}
                      onChange={(e) => handleHeaderChange(col.id, e.target.value)}
                      className="table-header-input"
                      placeholder="Column name"
                    />
                    <button
                      className="delete-col-btn"
                      onClick={() => deleteColumn(col.id)}
                      title="Delete column"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  {colIndex < table.columns.length - 1 && (
                    <div
                      className="column-resize-handle"
                      onMouseDown={(e) => handleResizeStart(e, colIndex)}
                    />
                  )}
                </th>
              ))}
              <th className="add-column-cell">
                <button className="add-column-btn" onClick={addColumn} title="Add column">
                  <FiPlus />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id}>
                {table.columns.map((col) => (
                  <td key={col.id} style={{ width: col.width }}>
                    <input
                      type="text"
                      value={row.cells[col.id] || ''}
                      onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                      className="table-cell-input"
                      placeholder="Empty"
                    />
                  </td>
                ))}
                <td className="row-actions-cell">
                  <button
                    className="delete-row-btn"
                    onClick={() => deleteRow(row.id)}
                    title="Delete row"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-row-btn" onClick={addRow}>
        <FiPlus /> Add Row
      </button>
    </div>
  )
}

export default TableBlock
