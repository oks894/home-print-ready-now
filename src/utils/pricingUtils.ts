export const calculateBulkPrice = (basePrice: number, quantity: number): number => {
  // If quantity is 50 or more, apply bulk pricing (₹2.5 per page)
  if (quantity >= 50) {
    return 2.5 * quantity;
  }
  
  // Otherwise use the base price
  return basePrice * quantity;
};

export const parsePriceFromString = (priceString: string): number => {
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
