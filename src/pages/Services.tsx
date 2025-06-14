
import React from 'react';
import { FileText, Palette, Package, Camera, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useServices } from '@/hooks/useServices';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'printing': return FileText;
    case 'color': return Palette;
    case 'delivery': return Truck;
    case 'binding': return Package;
    case 'photo': return Camera;
    default: return FileText;
  }
};

const Services = () => {
  const { services, isLoading } = useServices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <section className="py-16 px-4 bg-gray-50 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
