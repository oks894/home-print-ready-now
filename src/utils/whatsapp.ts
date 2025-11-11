// WhatsApp message utilities

export interface WhatsAppMessageData {
  name: string;
  amount: number;
  service: string;
  trackingId?: string;
  currency?: string;
}

export const generatePaymentMessage = ({
  name,
  amount,
  service,
  trackingId,
  currency = '₹'
}: WhatsAppMessageData): string => {
  let message = `Hello Ellio Team,\n\n`;
  message += `I've paid ${currency}${amount} for ${service}.\n\n`;
  message += `Name: ${name}\n`;
  
  if (trackingId) {
    message += `Tracking ID: ${trackingId}\n`;
  }
  
  message += `\nPlease verify my payment. Thank you!`;
  
  return message;
};

export const openWhatsApp = (phoneNumber: string, message: string): void => {
  // Remove any non-digit characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
};

export const generateWhatsAppLink = (phoneNumber: string, message: string): string => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};
