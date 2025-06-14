
export const calculateBulkPrice = (basePrice: number, quantity: number): number => {
  // If quantity is 50 or more, apply bulk pricing (₹2.5 per page)
  if (quantity >= 50) {
    return 2.5 * quantity;
  }
  
  // Otherwise use the base price
  return basePrice * quantity;
};

export const parsePriceFromString = (priceString: string): number => {
  // Handle different price formats
  if (priceString.includes('FREE') || priceString.includes('free')) {
    return 0;
  }
  
  // Handle "20 / 6 pcs" format
  if (priceString.includes('/') && priceString.includes('pcs')) {
    const match = priceString.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+)\s*pcs/);
    if (match) {
      const totalPrice = parseFloat(match[1]);
      const pieces = parseFloat(match[2]);
      return totalPrice / pieces; // Price per piece
    }
  }
  
  // Handle "₹X/page" or "₹X" format
  const match = priceString.match(/₹?(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

export const getBulkDiscountInfo = (quantity: number): { hasBulkDiscount: boolean; savings: number; originalPrice: number; discountedPrice: number } => {
  if (quantity < 50) {
    return { hasBulkDiscount: false, savings: 0, originalPrice: 0, discountedPrice: 0 };
  }

  const originalPrice = quantity * 3.5; // Assuming standard B&W price
  const discountedPrice = quantity * 2.5;
  const savings = originalPrice - discountedPrice;

  return {
    hasBulkDiscount: true,
    savings,
    originalPrice,
    discountedPrice
  };
};

export const calculateServicePrice = (service: any, quantity: number): number => {
  const basePrice = parsePriceFromString(service.price);
  
  // Apply bulk pricing for printing services
  if (service.category === 'Printing' || service.category === 'Color') {
    return calculateBulkPrice(basePrice, quantity);
  }
  
  // For other services, use regular pricing
  return basePrice * quantity;
};
