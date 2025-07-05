
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      jobId,
      trackingId,
      customerName,
      customerPhone,
      institute,
      timeSlot,
      notes,
      totalAmount,
      selectedServices,
      filesCount
    } = await req.json()

    console.log('New job notification received:', { jobId, trackingId, customerName })

    // Format services list
    let servicesList = 'Various services'
    if (selectedServices && Array.isArray(selectedServices)) {
      servicesList = selectedServices.map(service => 
        `${service.name} (Qty: ${service.quantity})`
      ).join(', ')
    }

    // Create WhatsApp message
    const message = `🔔 NEW PRINT JOB RECEIVED!

👤 Customer: ${customerName}
📱 Phone: ${customerPhone}
${institute ? `🏢 Institute: ${institute}\n` : ''}🆔 Tracking ID: ${trackingId}
📋 Services: ${servicesList}
📁 Files: ${filesCount} files
${totalAmount ? `💰 Amount: ₹${totalAmount}\n` : ''}⏰ Time Slot: ${timeSlot}
${notes ? `\n📝 Notes: ${notes}` : ''}

Please contact the customer to confirm details and arrange printing.`

    // Get WhatsApp API credentials
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY')
    
    if (!whatsappApiKey) {
      throw new Error('WhatsApp API key not configured')
    }

    // Send WhatsApp message using a generic WhatsApp API approach
    // This example uses a common WhatsApp Business API format
    const whatsappResponse = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '917005498122', // Admin phone number
        type: 'text',
        text: {
          body: message
        }
      }),
    })

    if (!whatsappResponse.ok) {
      const errorText = await whatsappResponse.text()
      console.error('WhatsApp API error:', errorText)
      
      // Fallback: Try alternative WhatsApp service format (for services like 360Dialog)
      try {
        const alternativeResponse = await fetch('https://waba.360dialog.io/v1/messages', {
          method: 'POST',
          headers: {
            'D360-API-KEY': whatsappApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: '917005498122',
            type: 'text',
            text: {
              body: message
            }
          }),
        })

        if (!alternativeResponse.ok) {
          throw new Error('Both WhatsApp API attempts failed')
        }

        console.log('WhatsApp message sent successfully via alternative API')
      } catch (altError) {
        console.error('Alternative WhatsApp API also failed:', altError)
        throw new Error('Failed to send WhatsApp notification')
      }
    } else {
      console.log('WhatsApp message sent successfully via Facebook API')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp notification sent successfully',
        jobId,
        trackingId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send WhatsApp notification'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
