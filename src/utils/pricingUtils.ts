
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

export const calculateTotalPages = (pages: number, copies: number, doubleSided: boolean = false): number => {
  const totalPages = pages * copies;
  return totalPages;
};

export const calculateDoubleSidedSheets = (pages: number, copies: number): number => {
  // For double-sided printing, calculate actual sheets needed
  // Each sheet can hold 2 pages (front and back)
  const totalPages = pages * copies;
  return Math.ceil(totalPages / 2);
};

export const calculateServicePrice = (service: any, quantity: number, options?: {
  pages?: number;
  copies?: number;
  doubleSided?: boolean;
}): number => {
  const basePrice = parsePriceFromString(service.price);
  
  // For printing services, calculate based on total pages or sheets
  if (service.category === 'Printing' || service.category === 'Color') {
    if (options?.pages && options?.copies) {
      if (options?.doubleSided) {
        // For double-sided, we charge per sheet but still apply bulk pricing based on total pages
        const totalPages = calculateTotalPages(options.pages, options.copies, options.doubleSided);
        const actualSheets = calculateDoubleSidedSheets(options.pages, options.copies);
        
        // Apply bulk pricing if total pages >= 50, but charge for actual sheets
        if (totalPages >= 50) {
          return actualSheets * 2.5; // Bulk price per sheet
        } else {
          return actualSheets * basePrice; // Regular price per sheet
        }
      } else {
        // Single-sided: charge per page
        const totalPages = calculateTotalPages(options.pages, options.copies, options.doubleSided);
        return calculateBulkPrice(basePrice, totalPages);
      }
    }
    // Fallback to quantity-based pricing
    return calculateBulkPrice(basePrice, quantity);
  }
  
  // For other services, use regular pricing
  return basePrice * quantity;
};

export const getPrintingPriceBreakdown = (pages: number, copies: number, isColor: boolean = false, doubleSided: boolean = false) => {
  const totalPages = calculateTotalPages(pages, copies, doubleSided);
  const basePrice = isColor ? 5 : 3.5; // Color: ₹5, B&W: ₹3.5
  
  let finalPrice: number;
  let pricePerUnit: number;
  let actualUnits: number;
  
  if (doubleSided) {
    // Double-sided: calculate sheets needed
    actualUnits = calculateDoubleSidedSheets(pages, copies);
    if (totalPages >= 50) {
      pricePerUnit = 2.5; // Bulk price per sheet
      finalPrice = actualUnits * pricePerUnit;
    } else {
      pricePerUnit = basePrice; // Regular price per sheet
      finalPrice = actualUnits * pricePerUnit;
    }
  } else {
    // Single-sided: calculate pages
    actualUnits = totalPages;
    finalPrice = calculateBulkPrice(basePrice, totalPages);
    pricePerUnit = totalPages >= 50 ? 2.5 : basePrice;
  }
  
  const hasBulkDiscount = totalPages >= 50;
  const originalPrice = doubleSided ? 
    calculateDoubleSidedSheets(pages, copies) * basePrice : 
    totalPages * basePrice;
  
  return {
    pages,
    copies,
    totalPages,
    actualUnits,
    doubleSided,
    isColor,
    basePrice,
    pricePerUnit,
    finalPrice,
    hasBulkDiscount,
    savings: hasBulkDiscount ? originalPrice - finalPrice : 0,
    unitType: doubleSided ? 'sheets' : 'pages'
  };
};
