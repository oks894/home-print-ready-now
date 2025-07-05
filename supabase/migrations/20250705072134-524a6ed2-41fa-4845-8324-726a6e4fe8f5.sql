
-- Create a function to handle new job notifications
CREATE OR REPLACE FUNCTION notify_new_job()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the WhatsApp notification edge function
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new job notifications
DROP TRIGGER IF EXISTS trigger_notify_new_job ON print_jobs;
CREATE TRIGGER trigger_notify_new_job
  AFTER INSERT ON print_jobs
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_job();
