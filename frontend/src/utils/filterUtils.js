import { getDueAlertBadge } from './dateUtils';

export function filterItems(items, filters) {
  if (!items || !Array.isArray(items)) return [];
  
  return items.filter(item => {
    // Project filter
    if (filters.projectId && item.projectId !== filters.projectId) {
      return false;
    }
    
    // Status filter
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && item.priority !== filters.priority) {
      return false;
    }
    
    // Task Type filter (only applies if the item has a 'type' property)
    if (filters.type && item.type !== filters.type) {
      return false;
    }
    
    // Assigned Employee filter
    if (filters.assignedTo && item.assignedTo !== filters.assignedTo) {
      return false;
    }
    
    // Due Alert filter
    if (filters.dueAlert) {
      const alert = getDueAlertBadge(item.dueDate, item.status);
      if (alert !== filters.dueAlert) {
        return false;
      }
    }
    
    // Search keyword filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const titleMatch = item.title && item.title.toLowerCase().includes(query);
      const descMatch = item.description && item.description.toLowerCase().includes(query);
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    
    return true;
  });
}
