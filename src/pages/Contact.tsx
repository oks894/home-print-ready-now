
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <section className="py-16 px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for all your printing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Call Us</CardTitle>
                <CardDescription>
                  Speak directly with our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="tel:+918787665349" 
                  className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  +91 8787665349
                </a>
                <p className="text-gray-600 mt-2">Available Mon-Sat: 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>
                  Quick and easy messaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://wa.me/918787665349" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  +91 8787665349
                </a>
                <p className="text-gray-600 mt-2">24/7 messaging support</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@printready.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Delivery Service</p>
                    <p className="text-gray-600">Powered by DROPEE</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <a 
                    href="tel:+918787665349" 
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  <a 
                    href="https://wa.me/918787665349" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Powered by DYNAMIC EDU</h4>
            <p className="text-gray-600">
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
