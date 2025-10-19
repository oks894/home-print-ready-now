import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Link, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useExternalLinks } from '@/hooks/useExternalLinks';
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

interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

export const MobileLinksManager = () => {
  const { links, isLoading, addLink, updateLink, deleteLink } = useExternalLinks();
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ExternalLink | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    icon: '',
    is_active: true
  });

  const handleAdd = async () => {
    if (!formData.title || !formData.url) return;
    const success = await addLink({ ...formData, display_order: links.length });
    if (success) {
      setFormData({ title: '', url: '', description: '', icon: '', is_active: true });
      setIsAddingOpen(false);
    }
  };

  const handleEdit = async () => {
    if (!editingLink) return;
    const success = await updateLink(editingLink.id, { ...formData, display_order: editingLink.display_order });
    if (success) {
      setEditingLink(null);
      setFormData({ title: '', url: '', description: '', icon: '', is_active: true });
    }
  };

  const openEditSheet = (link: ExternalLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      icon: link.icon,
      is_active: link.is_active
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteLink(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">External Links</h2>
            <p className="text-sm text-gray-600">{links.length} total links</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {links.filter(l => l.is_active).length}
          </Badge>
        </div>
        <TouchButton
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
          onClick={() => setIsAddingOpen(true)}
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Link
        </TouchButton>
      </div>

      {/* Links List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Link className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">No links yet</p>
            <p className="text-gray-400 text-sm mt-2">Add external links to share your projects</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white rounded-lg border p-4 ${!link.is_active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {link.icon && <span className="text-xl">{link.icon}</span>}
                      <h3 className="font-semibold truncate">{link.title}</h3>
                      {!link.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <TouchButton
                      size="sm"
                      variant="outline"
                      onClick={() => openEditSheet(link)}
                    >
                      <Edit className="w-4 h-4" />
                    </TouchButton>
                    <TouchButton
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </TouchButton>
                  </div>
                </div>
                {link.description && (
                  <p className="text-sm text-gray-600">{link.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add/Edit Sheet */}
      <Sheet
        open={isAddingOpen || !!editingLink}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingOpen(false);
            setEditingLink(null);
            setFormData({ title: '', url: '', description: '', icon: '', is_active: true });
          }
        }}
      >
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</SheetTitle>
            <SheetDescription>
              {editingLink ? 'Update link details' : 'Fill in the link information'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(85vh-180px)]">
            <div>
              <Label htmlFor="title">Link Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., My Portfolio"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🔗"
                className="mt-1"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the link"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {formData.is_active ? (
                  <Eye className="w-5 h-5 text-green-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <Label htmlFor="is_active" className="font-semibold">Visible</Label>
                  <p className="text-xs text-gray-500">Show this link in the footer</p>
                </div>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex gap-2">
            <TouchButton
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAddingOpen(false);
                setEditingLink(null);
                setFormData({ title: '', url: '', description: '', icon: '', is_active: true });
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </TouchButton>
            <TouchButton
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              onClick={editingLink ? handleEdit : handleAdd}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingLink ? 'Update' : 'Save'}
            </TouchButton>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this link. This action cannot be undone.
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
