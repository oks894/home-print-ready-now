
import React from 'react';
import { Truck, Phone, MessageCircle, FileText, Palette, Package, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Services = () => {
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
                <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Passport Printing</CardTitle>
                <CardDescription>
                  ₹20 for 6 pieces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional passport size photo printing service
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

            <Card className="text-center">
              <CardHeader>
                <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Binding Services</CardTitle>
                <CardDescription>
                  Professional binding available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Spiral binding, hardcover, and other binding options
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
