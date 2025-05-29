/**
 * Utility functions for managing saved tools
 */

/**
 * Add a tool to the user's saved tools list if it's not already there
 * @param toolId - The ID of the tool to add
 */
export function addToolToSaved(toolId: string): void {
  try {
    const savedToolsFromStorage = localStorage.getItem('savedTools');
    let savedTools: string[] = [];
    
    if (savedToolsFromStorage) {
      try {
        savedTools = JSON.parse(savedToolsFromStorage);
      } catch (error) {
        console.error('Failed to parse saved tools from localStorage:', error);
        savedTools = [];
      }
    }
    
    // Only add if it's not already in the list
    if (!savedTools.includes(toolId)) {
      savedTools.push(toolId);
      localStorage.setItem('savedTools', JSON.stringify(savedTools));
      
      // Dispatch a custom event to notify other components of the change
      window.dispatchEvent(new CustomEvent('savedToolsChanged', { 
        detail: { savedTools } 
      }));
    }
  } catch (error) {
    console.error('Failed to add tool to saved list:', error);
  }
}

/**
 * Remove a tool from the user's saved tools list
 * @param toolId - The ID of the tool to remove
 */
export function removeToolFromSaved(toolId: string): void {
  try {
    const savedToolsFromStorage = localStorage.getItem('savedTools');
    if (!savedToolsFromStorage) return;
    
    let savedTools: string[] = [];
    try {
      savedTools = JSON.parse(savedToolsFromStorage);
    } catch (error) {
      console.error('Failed to parse saved tools from localStorage:', error);
      return;
    }
    
    const updatedTools = savedTools.filter(id => id !== toolId);
    localStorage.setItem('savedTools', JSON.stringify(updatedTools));
    
    // Dispatch a custom event to notify other components of the change
    window.dispatchEvent(new CustomEvent('savedToolsChanged', { 
      detail: { savedTools: updatedTools } 
    }));
  } catch (error) {
    console.error('Failed to remove tool from saved list:', error);
  }
}

/**
 * Get the current list of saved tools
 * @returns Array of saved tool IDs
 */
export function getSavedTools(): string[] {
  try {
    const savedToolsFromStorage = localStorage.getItem('savedTools');
    if (!savedToolsFromStorage) return [];
    
    return JSON.parse(savedToolsFromStorage);
  } catch (error) {
    console.error('Failed to get saved tools from localStorage:', error);
    return [];
  }
}

/**
 * Check if a tool is currently saved
 * @param toolId - The ID of the tool to check
 * @returns True if the tool is saved, false otherwise
 */
export function isToolSaved(toolId: string): boolean {
  const savedTools = getSavedTools();
  return savedTools.includes(toolId);
} 