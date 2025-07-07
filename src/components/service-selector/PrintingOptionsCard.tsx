
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Info, FileText } from 'lucide-react';
import { Service, SelectedService } from '@/types/service';
import { getPrintingPriceBreakdown } from '@/utils/pricingUtils';

interface PrintingOptionsCardProps {
  service: Service;
  onAddService: (service: Service, quantity: number, options?: any) => void;
  selectedService?: SelectedService;
  onUpdateQuantity?: (serviceId: string, quantity: number, options?: any) => void;
  onRemoveService?: (serviceId: string) => void;
}

const PrintingOptionsCard = ({ 
  service, 
  onAddService, 
  selectedService, 
  onUpdateQuantity, 
  onRemoveService 
}: PrintingOptionsCardProps) => {
  const [pages, setPages] = useState<string>('');
  const [copies, setCopies] = useState(1);
  const [doubleSided, setDoubleSided] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  const isColor = service.category === 'Color';
  const isSelected = !!selectedService;

  useEffect(() => {
    const pagesNum = parseInt(pages) || 0;
    if (pagesNum > 0) {
      const breakdown = getPrintingPriceBreakdown(pagesNum, copies, isColor, doubleSided);
      setPriceBreakdown(breakdown);
    } else {
      setPriceBreakdown(null);
    }
  }, [pages, copies, doubleSided, isColor]);

  const handlePagesChange = (value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setPages(value);
    }
  };

  const handleAddService = () => {
    const pagesNum = parseInt(pages) || 0;
    if (pagesNum > 0 && priceBreakdown) {
      const options = { pages: pagesNum, copies, doubleSided };
      onAddService(service, priceBreakdown.finalPrice, options);
    }
  };

  const handleUpdateService = () => {
    const pagesNum = parseInt(pages) || 0;
    if (onUpdateQuantity && selectedService && pagesNum > 0 && priceBreakdown) {
      const options = { pages: pagesNum, copies, doubleSided };
      onUpdateQuantity(selectedService.id, priceBreakdown.finalPrice, options);
    }
  };

  const handleRemoveService = () => {
    if (onRemoveService && selectedService) {
      onRemoveService(selectedService.id);
    }
  };

  const canAddService = pages !== '' && parseInt(pages) > 0 && priceBreakdown;

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {service.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
          </div>
          {isColor && (
            <Badge className="bg-purple-100 text-purple-800">Color</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pages Input */}
        <div className="space-y-2">
          <Label htmlFor="pages">Number of Pages *</Label>
          <Input
            id="pages"
            type="text"
            value={pages}
            onChange={(e) => handlePagesChange(e.target.value)}
            placeholder="Enter number of pages"
            className="w-full"
          />
          {pages === '' && (
            <p className="text-xs text-gray-500">Please enter the number of pages to see pricing</p>
          )}
        </div>

        {/* Copies Input */}
        <div className="space-y-2">
          <Label htmlFor="copies">Number of Copies</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCopies(Math.max(1, copies - 1))}
              disabled={copies <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              id="copies"
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCopies(copies + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Double-sided option */}
        <div className="flex items-center space-x-2">
          <Switch
            id="double-sided"
            checked={doubleSided}
            onCheckedChange={setDoubleSided}
          />
          <Label htmlFor="double-sided" className="flex items-center gap-2">
            Double-sided printing
            <span className="text-xs text-gray-500">(saves paper & cost)</span>
          </Label>
        </div>

        {/* Price Breakdown */}
        {priceBreakdown && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Pages:</span>
              <span className="font-medium">{priceBreakdown.totalPages} pages</span>
            </div>
            {priceBreakdown.doubleSided && (
              <div className="flex justify-between text-sm">
                <span>Actual Sheets:</span>
                <span className="font-medium">{priceBreakdown.actualUnits} sheets</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Price per {priceBreakdown.unitType.slice(0, -1)}:</span>
              <span className="font-medium">₹{priceBreakdown.pricePerUnit}</span>
            </div>
            {priceBreakdown.hasBulkDiscount && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Info className="w-4 h-4" />
                <span>Bulk discount applied! Saved ₹{priceBreakdown.savings.toFixed(2)}</span>
              </div>
            )}
            {priceBreakdown.doubleSided && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Info className="w-4 h-4" />
                <span>Double-sided saves {priceBreakdown.totalPages - priceBreakdown.actualUnits} sheets!</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-blue-600">₹{priceBreakdown.finalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isSelected ? (
            <>
              <Button 
                onClick={handleUpdateService} 
                className="flex-1"
                disabled={!canAddService}
              >
                Update Service
              </Button>
              <Button variant="outline" onClick={handleRemoveService}>
                Remove
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleAddService} 
              className="w-full"
              disabled={!canAddService}
            >
              Add to Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintingOptionsCard;
