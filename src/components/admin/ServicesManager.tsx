
import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export const ServicesManager = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Document Printing',
      description: 'High-quality black and white document printing',
      price: '₹3.5/page',
      category: 'Printing'
    },
    {
      id: '2',
      name: 'Color Printing',
      description: 'Vibrant color printing for presentations and photos',
      price: '₹5/page',
      category: 'Printing'
    },
    {
      id: '3',
      name: 'Bulk Printing',
      description: 'Cost-effective printing for large quantities',
      price: '₹2.5/page (50+)',
      category: 'Printing'
    },
    {
      id: '4',
      name: 'Binding Services',
      description: 'Professional binding for documents and books',
      price: '₹50-200',
      category: 'Binding'
    },
    {
      id: '5',
      name: 'Doorstep Delivery',
      description: 'Convenient delivery to your location',
      price: '₹20-50',
      category: 'Delivery'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast({
        title: "Error",
        description: "Please fill in at least the name and price",
        variant: "destructive"
      });
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      ...newService
    };

    setServices(prev => [...prev, service]);
    setNewService({ name: '', description: '', price: '', category: '' });
    setIsAdding(false);

    toast({
      title: "Service added",
      description: "New service has been added successfully"
    });
  };

  const handleEditService = (id: string, updatedService: Omit<Service, 'id'>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
    setEditingId(null);

    toast({
      title: "Service updated",
      description: "Service has been updated successfully"
    });
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    
    toast({
      title: "Service deleted",
      description: "Service has been removed"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Services Management</h2>
          <p className="text-gray-600">Manage your printing services and pricing</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Add New Service Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
            <CardDescription>Fill in the details for the new service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Document Printing"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., ₹3.5/page"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newService.category}
                onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Printing, Binding, Delivery"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the service"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddService}>
                <Save className="w-4 h-4 mr-2" />
                Save Service
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            isEditing={editingId === service.id}
            onEdit={() => setEditingId(service.id)}
            onSave={(updatedService) => handleEditService(service.id, updatedService)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDeleteService(service.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const ServiceCard = ({ service, isEditing, onEdit, onSave, onCancel, onDelete }: ServiceCardProps) => {
  const [editedService, setEditedService] = useState<Omit<Service, 'id'>>({
    name: service.name,
    description: service.description,
    price: service.price,
    category: service.category
  });

  const handleSave = () => {
    onSave(editedService);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                value={editedService.name}
                onChange={(e) => setEditedService(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                value={editedService.price}
                onChange={(e) => setEditedService(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Input
              id="edit-category"
              value={editedService.category}
              onChange={(e) => setEditedService(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={editedService.description}
              onChange={(e) => setEditedService(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{service.name}</h3>
              <span className="text-lg font-bold text-blue-600">{service.price}</span>
            </div>
            {service.category && (
              <p className="text-sm text-blue-600 mb-2">{service.category}</p>
            )}
            {service.description && (
              <p className="text-gray-600">{service.description}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
