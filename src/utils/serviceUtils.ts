
export const getServiceIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Printing': '📄',
    'Color': '🎨',
    'Delivery': '🚚',
    'Binding': '📚'
  };
  return icons[category] || '📄';
};

export const isPrintingService = (category: string) => {
  return category === 'Printing' || category === 'Color';
};
