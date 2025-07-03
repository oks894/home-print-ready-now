
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const { jobId, status, customerName, phone, trackingId } = await req.json()
    console.log('Sending notifications for job:', jobId, 'status:', status)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('print_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error(`Job not found: ${jobError?.message}`)
    }

    const statusMessages = {
      'pending': `Your print order ${trackingId} has been received and is being processed. We'll call you shortly to confirm details.`,
      'pending_payment': `Your print order ${trackingId} is ready for payment. Please complete payment to proceed with printing.`,
      'printing': `Great news! Your print order ${trackingId} is now being printed with premium quality materials.`,
      'ready': `🎉 Your print order ${trackingId} is ready for pickup! Please collect it at your scheduled time.`,
      'completed': `✅ Your print order ${trackingId} has been completed. Thank you for choosing our services!`
    }

    const message = statusMessages[status as keyof typeof statusMessages] || `Your print order ${trackingId} status has been updated to ${status}.`

    // Send SMS if enabled and Twilio credentials are available
    if (job.sms_notifications && Deno.env.get('TWILIO_ACCOUNT_SID') && Deno.env.get('TWILIO_AUTH_TOKEN')) {
      try {
        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: Deno.env.get('TWILIO_PHONE_NUMBER') || '',
            To: phone,
            Body: message
          }),
        })

        if (!twilioResponse.ok) {
          console.error('Twilio SMS failed:', await twilioResponse.text())
        } else {
          console.log('SMS sent successfully to:', phone)
        }
      } catch (smsError) {
        console.error('SMS sending error:', smsError)
      }
    }

    // Send email if enabled and Resend API key is available
    if (job.email_notifications && Deno.env.get('RESEND_API_KEY')) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Print Service <notifications@yourdomain.com>',
            to: [job.phone + '@example.com'], // You might want to collect email addresses
            subject: `Print Order Update - ${trackingId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Print Order Status Update</h2>
                <p>Hello ${customerName},</p>
                <p>${message}</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <strong>Order Details:</strong><br>
                  Tracking ID: ${trackingId}<br>
                  Status: ${status.replace('_', ' ').toUpperCase()}<br>
                  ${job.estimated_completion ? `Estimated Completion: ${new Date(job.estimated_completion).toLocaleString()}` : ''}
                </div>
                <p>Track your order: <a href="${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/track">Click here</a></p>
                <p>Thank you for choosing our print services!</p>
              </div>
            `
          }),
        })

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text())
        } else {
          console.log('Email sent successfully')
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Notification sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
