
import React from 'react';
import { Truck, Phone, MessageCircle, FileText, Palette, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'printing': return FileText;
    case 'color': return Palette;
    case 'delivery': return Truck;
    case 'binding': return Package;
    default: return FileText;
  }
};

const Services = () => {
  const { services, isLoading } = useServices();

  return (
    <section id="services" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional printing services with doorstep delivery powered by DYNAMIC EDU
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <Skeleton className="w-12 h-12 mx-auto mb-4 rounded" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))
          ) : (
            services.map((service) => {
              const IconComponent = getServiceIcon(service.category);
              return (
                <Card key={service.id} className="text-center">
                  <CardHeader>
                    <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>
                      {service.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:+918787665349" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call: +91 8787665349
            </a>
            <a 
              href="https://wa.me/918787665349" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
