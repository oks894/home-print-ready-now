
-- Update the function to handle missing net extension gracefully
CREATE OR REPLACE FUNCTION notify_new_job()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to call the WhatsApp notification, but don't fail if net extension is missing
  BEGIN
    PERFORM net.http_post(
      url := 'https://mkeicfcxowshfhipkmfd.supabase.co/functions/v1/send-whatsapp-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'jobId', NEW.id,
        'trackingId', NEW.tracking_id,
        'customerName', NEW.name,
        'customerPhone', NEW.phone,
        'institute', NEW.institute,
        'timeSlot', NEW.time_slot,
        'notes', NEW.notes,
        'totalAmount', NEW.total_amount,
        'selectedServices', NEW.selected_services,
        'filesCount', jsonb_array_length(NEW.files)
      )
    );
  EXCEPTION 
    WHEN undefined_function THEN
      -- Log that WhatsApp notification failed due to missing net extension
      RAISE NOTICE 'WhatsApp notification skipped: net extension not available';
    WHEN OTHERS THEN
      -- Log any other errors but don't fail the insert
      RAISE NOTICE 'WhatsApp notification failed: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
