import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  created_at?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const defaultServices = [
    {
      id: '1',
      name: 'Document Printing',
      description: 'High-quality black and white document printing',
      price: '₹3.5/page',
      category: 'Printing'
    },
    {
      id: '2',
      name: 'Color Printing',
      description: 'Vibrant color printing for presentations, photos, and graphics',
      price: '₹5/page',
      category: 'Color'
    },
    {
      id: '3',
      name: 'Doorstep Delivery',
      description: 'Powered by DROPEE - Standard pricing applies for orders below ₹900',
      price: 'FREE for orders ₹900+',
      category: 'Delivery'
    }
  ];

  const loadServices = async () => {
    console.log('Loading services...');
    setIsLoading(true);
    
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error loading services from Supabase:', error);
        console.log('Using default services');
        setServices(defaultServices);
        return;
      }

      if (data && data.length > 0) {
        console.log('Using services from database:', data);
        setServices(data);
      } else {
        console.log('No services in database, using defaults');
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      console.log('Using default services due to error');
      setServices(defaultServices);
    } finally {
      setIsLoading(false);
    }
  };

  const addService = async (service: Omit<Service, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) {
        console.error('Error adding service:', error);
        toast({
          title: "Error",
          description: "Failed to add service. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        setServices(prev => [...prev, data]);
        toast({
          title: "Service added",
          description: "New service has been added successfully"
        });
        return true;
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    return false;
  };

  const updateService = async (id: string, updates: Omit<Service, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        toast({
          title: "Error",
          description: "Failed to update service. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        setServices(prev => prev.map(service => service.id === id ? data : service));
        toast({
          title: "Service updated",
          description: "Service has been updated successfully"
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    return false;
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        toast({
          title: "Error",
          description: "Failed to delete service. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Service deleted",
        description: "Service has been removed"
      });
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return {
    services,
    isLoading,
    addService,
    updateService,
    deleteService,
    reloadServices: loadServices
  };
};
