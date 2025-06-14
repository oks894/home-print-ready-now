
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <section className="py-16 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, affordable pricing for all your printing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Document Printing</CardTitle>
                <CardDescription className="text-3xl font-bold text-blue-600">₹3.5<span className="text-sm text-gray-500">/page</span></CardDescription>
                <p className="text-xs text-gray-500">₹2.5/page for 50+ pages</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Black & White</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">High Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Same Day Service</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Bulk Printing</CardTitle>
                <CardDescription className="text-3xl font-bold text-green-600">₹2.5<span className="text-sm text-gray-500">/page</span></CardDescription>
                <p className="text-xs text-gray-500">50+ pages (B&W)</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Volume Discount</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Black & White</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Best Value</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Color Printing</CardTitle>
                <CardDescription className="text-3xl font-bold text-purple-600">₹5<span className="text-sm text-gray-500">/page</span></CardDescription>
                <p className="text-xs text-gray-500">₹2.5/page for 50+ pages</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Full Color</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Photo Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Bulk Discounts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Passport Photos</CardTitle>
                <CardDescription className="text-3xl font-bold text-orange-600">₹20<span className="text-sm text-gray-500">/6 pcs</span></CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Standard Size</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">6 Copies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Professional Quality</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pricing Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Black & White Printing</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>1-49 pages:</span>
                    <span className="font-medium">₹3.5 per page</span>
                  </li>
                  <li className="flex justify-between">
                    <span>50+ pages:</span>
                    <span className="font-medium text-green-600">₹2.5 per page</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Color Printing</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>1-49 pages:</span>
                    <span className="font-medium">₹5 per page</span>
                  </li>
                  <li className="flex justify-between">
                    <span>50+ pages:</span>
                    <span className="font-medium text-green-600">₹2.5 per page</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-8 bg-green-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Delivery</h3>
            <p className="text-lg text-gray-600 mb-4">
              Get free doorstep delivery for orders above ₹200
            </p>
            <p className="text-sm text-gray-500">
              Powered by DROPEE - Standard delivery charges apply for orders below ₹200
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
