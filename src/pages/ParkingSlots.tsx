
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockParkingSlots } from '../data/mockData';
import { ParkingSlot } from '../types';
import { ParkingSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ParkingSlots = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>(mockParkingSlots);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [newSlot, setNewSlot] = useState<Partial<ParkingSlot>>({
    name: '',
    section: '',
    type: 'standard',
    isActive: true,
    isOccupied: false,
  });

  // Count available and occupied slots
  const availableSlots = slots.filter(slot => slot.isActive && !slot.isOccupied).length;
  const occupiedSlots = slots.filter(slot => slot.isActive && slot.isOccupied).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNewSlot(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddOrUpdateSlot = () => {
    if (editingSlot) {
      // Update existing slot
      setSlots(slots.map(slot => 
        slot.id === editingSlot.id ? {...slot, ...newSlot} : slot
      ));
      toast({
        title: "Parking slot updated",
        description: `Slot ${newSlot.name} has been updated successfully`,
      });
    } else {
      // Add new slot
      const id = (Math.max(...slots.map(s => parseInt(s.id))) + 1).toString();
      setSlots([...slots, { id, ...newSlot as ParkingSlot }]);
      toast({
        title: "Parking slot added",
        description: `Slot ${newSlot.name} has been added successfully`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingSlot(null);
    setNewSlot({
      name: '',
      section: '',
      type: 'standard',
      isActive: true,
      isOccupied: false,
    });
  };

  const handleEditSlot = (slot: ParkingSlot) => {
    setEditingSlot(slot);
    setNewSlot({
      name: slot.name,
      section: slot.section,
      type: slot.type,
      isActive: slot.isActive,
      isOccupied: slot.isOccupied,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSlot = (id: string) => {
    const slotToDelete = slots.find(s => s.id === id);
    if (slotToDelete?.isOccupied) {
      toast({
        title: "Cannot delete occupied slot",
        description: "Please ensure the slot is vacated before deletion.",
        variant: "destructive"
      });
      return;
    }
    
    setSlots(slots.filter(slot => slot.id !== id));
    toast({
      title: "Parking slot deleted",
      description: "The parking slot has been removed from the system"
    });
  };

  const handleToggleStatus = (id: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? {...slot, isActive: !slot.isActive} : slot
    ));
    
    const slot = slots.find(s => s.id === id);
    toast({
      title: `Slot ${slot?.name} ${!slot?.isActive ? 'activated' : 'deactivated'}`,
      description: `The slot is now ${!slot?.isActive ? 'available' : 'unavailable'} for booking`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <ParkingSquare className="mr-2" /> Parking Slots Management
          </h1>
          <p className="text-muted-foreground">Add, update, and remove parking slots</p>
        </div>
        <button 
          onClick={() => {
            setEditingSlot(null);
            setNewSlot({
              name: '',
              section: '',
              type: 'standard',
              isActive: true,
              isOccupied: false,
            });
            setIsDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-primary">
            <ParkingSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Total Slots</p>
          <p className="ep-stats-card-value">{slots.filter(s => s.isActive).length}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-green-500">
            <ParkingSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Available Slots</p>
          <p className="ep-stats-card-value">{availableSlots}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-orange-500">
            <ParkingSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Occupied Slots</p>
          <p className="ep-stats-card-value">{occupiedSlots}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell className="font-medium">{slot.id}</TableCell>
                <TableCell>{slot.name}</TableCell>
                <TableCell>{slot.section}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    slot.type === 'standard' ? 'bg-blue-100 text-blue-800' :
                    slot.type === 'compact' ? 'bg-green-100 text-green-800' :
                    slot.type === 'handicapped' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {slot.isOccupied ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Occupied
                    </span>
                  ) : slot.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-muted rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleEditSlot(slot)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(slot.id)}>
                          <span className="mr-2 h-4 w-4">
                            {slot.isActive ? '🔴' : '🟢'}
                          </span>
                          <span>{slot.isActive ? 'Deactivate' : 'Activate'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-red-600"
                          disabled={slot.isOccupied}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlot ? 'Edit Parking Slot' : 'Add New Parking Slot'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={newSlot.name || ''}
                onChange={handleInputChange}
                placeholder="A1, B2, etc."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">Section</Label>
              <Input
                id="section"
                name="section"
                value={newSlot.section || ''}
                onChange={handleInputChange}
                placeholder="A, B, C, etc."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select
                id="type"
                name="type"
                value={newSlot.type || 'standard'}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="handicapped">Handicapped</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Status</Label>
              <div className="flex items-center col-span-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newSlot.isActive}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="isActive" className="text-sm font-normal">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddOrUpdateSlot}
              className="ml-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              disabled={!newSlot.name || !newSlot.section}
            >
              {editingSlot ? 'Update' : 'Add'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingSlots;
