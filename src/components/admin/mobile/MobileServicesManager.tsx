import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Package } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useServices } from '@/hooks/useServices';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

export const MobileServicesManager = () => {
  const { services, isLoading, addService, updateService, deleteService } = useServices();
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleAdd = async () => {
    if (!formData.name || !formData.price) return;
    const success = await addService(formData);
    if (success) {
      setFormData({ name: '', description: '', price: '', category: '' });
      setIsAddingOpen(false);
    }
  };

  const handleEdit = async () => {
    if (!editingService) return;
    const success = await updateService(editingService.id, {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category
    });
    if (success) {
      setEditingService(null);
      setFormData({ name: '', description: '', price: '', category: '' });
    }
  };

  const openEditSheet = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteService(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-green-50 to-emerald-50 p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            <p className="text-sm text-gray-600">{services.length} active services</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {services.length}
          </Badge>
        </div>
        <TouchButton
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white"
          onClick={() => setIsAddingOpen(true)}
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Service
        </TouchButton>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">No services yet</p>
            <p className="text-gray-400 text-sm mt-2">Add your first service to get started</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-lg border p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{service.name}</h3>
                    <p className="text-xl font-bold text-green-600 mt-1">{service.price}</p>
                    {service.category && (
                      <Badge variant="outline" className="mt-2">
                        {service.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 ml-2">
                    <TouchButton
                      size="sm"
                      variant="outline"
                      onClick={() => openEditSheet(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </TouchButton>
                    <TouchButton
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </TouchButton>
                  </div>
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600">{service.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add/Edit Sheet */}
      <Sheet
        open={isAddingOpen || !!editingService}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingOpen(false);
            setEditingService(null);
            setFormData({ name: '', description: '', price: '', category: '' });
          }
        }}
      >
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>{editingService ? 'Edit Service' : 'Add New Service'}</SheetTitle>
            <SheetDescription>
              {editingService ? 'Update service details' : 'Fill in the service information'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(85vh-180px)]">
            <div>
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Document Printing"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., ₹3.5/page"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Printing, Binding"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the service"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex gap-2">
            <TouchButton
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAddingOpen(false);
                setEditingService(null);
                setFormData({ name: '', description: '', price: '', category: '' });
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </TouchButton>
            <TouchButton
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
              onClick={editingService ? handleEdit : handleAdd}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingService ? 'Update' : 'Save'}
            </TouchButton>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this service. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
