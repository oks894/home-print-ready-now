
import React from 'react';
import { QrCode, Smartphone, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentQR = () => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quick Payment
          </h2>
          <p className="text-lg text-gray-600">
            Pay easily using UPI - Scan the QR code below
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <Card className="text-center">
            <CardHeader>
              <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>UPI Payment</CardTitle>
              <CardDescription>
                Scan this QR code with any UPI app to make payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 rounded-lg shadow-inner mb-4">
                <img 
                  src="/lovable-uploads/ce4e9864-2bc2-4ca6-9123-fb22d1139ff6.png" 
                  alt="UPI QR Code for Payment" 
                  className="w-64 h-64 mx-auto object-contain"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">UPI ID:</p>
                <p className="font-mono text-lg font-bold text-blue-600">8787665349@okbizaxis</p>
                <p className="text-sm text-gray-500">Next Gen Enterprise Pvt Ltd</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 1: Open UPI App</h3>
                <p className="text-gray-600">Open any UPI app like GPay, PhonePe, Paytm, or BHIM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 2: Scan QR Code</h3>
                <p className="text-gray-600">Use the scanner in your UPI app to scan the QR code</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 3: Complete Payment</h3>
                <p className="text-gray-600">Enter the amount and complete the payment securely</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Supported Apps</h4>
              <p className="text-sm text-blue-700">Google Pay, PhonePe, Paytm, BHIM UPI, and all other UPI-enabled apps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentQR;
