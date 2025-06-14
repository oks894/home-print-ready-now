
import React from 'react';
import { Truck, Phone, MessageCircle, FileText, Palette, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
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
          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Document Printing</CardTitle>
              <CardDescription>
                ₹3.5 per page (₹2.5 per page for 50+ pages)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                High-quality black & white printing for all your documents
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Color Printing</CardTitle>
              <CardDescription>
                ₹5 per page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Vibrant color printing for presentations, photos, and graphics
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Doorstep Delivery</CardTitle>
              <CardDescription>
                FREE for orders ₹900+
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Powered by DROPEE - Standard pricing applies for orders below ₹900
              </p>
            </CardContent>
          </Card>
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
