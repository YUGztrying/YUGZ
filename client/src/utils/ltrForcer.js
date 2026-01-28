/**
 * Ultimate LTR Enforcer - Forces left-to-right text direction
 * Prevents any RTL behavior caused by browser auto-detection
 */

export function enforceLTR() {
  // Force LTR on all text input elements
  const forceLTROnElement = (element) => {
    if (!element) return
    
    element.setAttribute('dir', 'ltr')
    element.style.direction = 'ltr'
    element.style.textAlign = 'left'
    element.style.unicodeBidi = 'embed' // embed instead of bidi-override
    
    // Remove any conflicting attributes
    element.removeAttribute('rtl')
  }

  // Handle input/change events to re-apply LTR
  const handleInput = (e) => {
    const element = e.target
    if (
      element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.isContentEditable
    ) {
      forceLTROnElement(element)
      
      // Also set selection to ensure cursor is on the left
      if (element.isContentEditable && element.textContent.length === 0) {
        const selection = window.getSelection()
        if (selection && element.firstChild) {
          selection.setPosition(element.firstChild, 0)
        }
      }
    }
  }

  // Apply to all existing elements
  const applyToAll = () => {
    const elements = document.querySelectorAll(
      'input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable]'
    )
    elements.forEach(forceLTROnElement)
  }

  // Observe DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (
            node.tagName === 'INPUT' ||
            node.tagName === 'TEXTAREA' ||
            node.isContentEditable
          ) {
            forceLTROnElement(node)
          }
          
          // Check children
          if (node.querySelectorAll) {
            const children = node.querySelectorAll(
              'input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable]'
            )
            children.forEach(forceLTROnElement)
          }
        }
      })
    })
  })

  // Start observer
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['dir', 'style']
    })
  }

  // Add event listeners
  document.addEventListener('input', handleInput, true)
  document.addEventListener('keydown', handleInput, true)
  document.addEventListener('focus', handleInput, true)
  
  // Apply on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyToAll)
  } else {
    applyToAll()
  }

  // Apply every 100ms for the first 2 seconds (catch any async renders)
  let count = 0
  const interval = setInterval(() => {
    applyToAll()
    count++
    if (count > 20) clearInterval(interval)
  }, 100)
}
