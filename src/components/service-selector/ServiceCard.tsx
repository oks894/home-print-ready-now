
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X } from 'lucide-react';
import { Service, SelectedService } from '@/types/service';
import { getBulkDiscountInfo } from '@/utils/pricingUtils';
import { getServiceIcon, isPrintingService } from '@/utils/serviceUtils';
import BulkDiscountAlert from './BulkDiscountAlert';

interface ServiceCardProps {
  service: Service;
  selectedService?: SelectedService;
  onAddService: (service: Service) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selectedService,
  onAddService,
  onUpdateQuantity,
  onRemoveService
}) => {
  const bulkInfo = selectedService && isPrintingService(service.category || '') 
    ? getBulkDiscountInfo(selectedService.quantity) 
    : null;

  return (
    <Card key={service.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getServiceIcon(service.category || '')}</span>
          <div>
            <CardTitle className="text-base">{service.name}</CardTitle>
            <CardDescription className="font-semibold text-blue-600">
              {service.price}
              {isPrintingService(service.category || '') && (
                <span className="block text-xs text-green-600">
                  ₹2.5/page for 50+ pages
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
        
        {selectedService ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(service.id, selectedService.quantity - 1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={selectedService.quantity}
                onChange={(e) => onUpdateQuantity(service.id, parseInt(e.target.value) || 0)}
                className="w-16 text-center"
                min="0"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(service.id, selectedService.quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveService(service.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            <BulkDiscountAlert 
              bulkInfo={bulkInfo}
              quantity={selectedService.quantity}
              serviceCategory={service.category || ''}
            />

            <div className="text-sm font-medium text-green-600">
              Total: ₹{selectedService.calculatedPrice.toFixed(2)}
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => onAddService(service)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
