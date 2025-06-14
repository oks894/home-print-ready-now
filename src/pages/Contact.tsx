
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Get in touch with us for all your printing needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <Card className="text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">Call Us</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Speak directly with our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="tel:+917005498122" 
                  className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  +91 7005498122
                </a>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Available Mon-Sat: 9AM-5PM</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3 sm:pb-4">
                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">WhatsApp</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Quick and easy messaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://wa.me/917005498122" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl font-bold text-green-600 hover:text-green-700 transition-colors break-all"
                >
                  +91 7005498122
                </a>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">24/7 messaging support</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Get in Touch</h3>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Location</p>
                    <p className="text-gray-600 text-sm sm:text-base">Viewland Zone II / Opposite Warm Delights</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Delivery Service</p>
                    <p className="text-gray-600 text-sm sm:text-base">Powered by DROPEE</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Business Hours</p>
                    <p className="text-gray-600 text-sm sm:text-base">Monday - Saturday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Quick Actions</h4>
                <div className="space-y-2 sm:space-y-3">
                  <a 
                    href="tel:+917005498122" 
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  <a 
                    href="https://wa.me/917005498122" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Powered by DYNAMIC EDU</h4>
            <p className="text-gray-600 text-sm sm:text-base">
              Professional printing solutions with reliable doorstep delivery service
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
