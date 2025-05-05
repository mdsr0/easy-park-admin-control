
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockDiscounts } from '../data/mockData';
import { Discount } from '../types';
import { TicketPercent, Plus, Edit, Trash2, Copy } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';

const Discounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    currentUsage: 0,
  });

  // Count active and expired discounts
  const activeDiscounts = discounts.filter(discount => discount.isActive).length;
  const inactiveDiscounts = discounts.filter(discount => !discount.isActive).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name === 'discountValue' || name === 'usageLimit' || name === 'minBookingHours') {
      setNewDiscount(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else if (type === 'checkbox') {
      setNewDiscount(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewDiscount(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddOrUpdateDiscount = () => {
    if (editingDiscount) {
      // Update existing discount
      setDiscounts(discounts.map(discount => 
        discount.id === editingDiscount.id ? {...discount, ...newDiscount} : discount
      ));
      toast({
        title: "Discount updated",
        description: `Discount "${newDiscount.name}" has been updated successfully`,
      });
    } else {
      // Add new discount
      const id = (Math.max(...discounts.map(d => parseInt(d.id))) + 1).toString();
      setDiscounts([...discounts, { id, ...newDiscount, currentUsage: 0 } as Discount]);
      toast({
        title: "Discount added",
        description: `Discount "${newDiscount.name}" has been added successfully`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingDiscount(null);
    setNewDiscount({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      currentUsage: 0,
    });
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setNewDiscount({
      code: discount.code,
      name: discount.name,
      description: discount.description,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      minBookingHours: discount.minBookingHours,
      validFrom: discount.validFrom,
      validUntil: discount.validUntil,
      isActive: discount.isActive,
      usageLimit: discount.usageLimit,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(discount => discount.id !== id));
    toast({
      title: "Discount deleted",
      description: "The discount has been removed from the system"
    });
  };

  const handleToggleStatus = (id: string) => {
    setDiscounts(discounts.map(discount => 
      discount.id === id ? {...discount, isActive: !discount.isActive} : discount
    ));
    
    const discount = discounts.find(d => d.id === id);
    toast({
      title: `Discount "${discount?.name}" ${!discount?.isActive ? 'activated' : 'deactivated'}`,
      description: `The discount code is now ${!discount?.isActive ? 'active' : 'inactive'}`
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: `Copied "${code}" to clipboard`,
    });
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setNewDiscount(prev => ({...prev, code: result}));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <TicketPercent className="mr-2" /> Discounts & Promotions
          </h1>
          <p className="text-muted-foreground">Create and manage promotional discounts and special deals</p>
        </div>
        <button 
          onClick={() => {
            setEditingDiscount(null);
            setNewDiscount({
              code: '',
              name: '',
              description: '',
              discountType: 'percentage',
              discountValue: 10,
              validFrom: new Date().toISOString().split('T')[0],
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              isActive: true,
              currentUsage: 0,
            });
            setIsDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Discount
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-primary">
            <TicketPercent className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Total Discounts</p>
          <p className="ep-stats-card-value">{discounts.length}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-green-500">
            <TicketPercent className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Active Discounts</p>
          <p className="ep-stats-card-value">{activeDiscounts}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-orange-500">
            <TicketPercent className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Inactive Discounts</p>
          <p className="ep-stats-card-value">{inactiveDiscounts}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-1">
                    {discount.code}
                    <button 
                      onClick={() => handleCopyCode(discount.code)}
                      className="p-1 hover:bg-muted rounded-md"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    {discount.name}
                    <div className="text-xs text-muted-foreground">{discount.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {discount.discountType === 'percentage' ? 
                    `${discount.discountValue}%` : 
                    `$${discount.discountValue.toFixed(2)}`
                  }
                  {discount.minBookingHours && (
                    <div className="text-xs text-muted-foreground">
                      Min {discount.minBookingHours}h booking
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>From: {discount.validFrom}</div>
                    <div>To: {discount.validUntil}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {discount.usageLimit ? 
                    `${discount.currentUsage} / ${discount.usageLimit}` : 
                    `${discount.currentUsage} (unlimited)`
                  }
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {discount.isActive ? 'Active' : 'Inactive'}
                  </span>
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
                        <DropdownMenuItem onClick={() => handleCopyCode(discount.code)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy Code</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDiscount(discount)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(discount.id)}>
                          <span className="mr-2 h-4 w-4">
                            {discount.isActive ? '🔴' : '🟢'}
                          </span>
                          <span>{discount.isActive ? 'Deactivate' : 'Activate'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-red-600"
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Add New Discount'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Code</Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="code"
                  name="code"
                  value={newDiscount.code || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., SUMMER20"
                  className="flex-1"
                />
                <button 
                  onClick={generateRandomCode}
                  className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                >
                  Generate
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={newDiscount.name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newDiscount.description || ''}
                onChange={handleInputChange}
                placeholder="Brief description of the discount"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">Type</Label>
              <select
                id="discountType"
                name="discountType"
                value={newDiscount.discountType || 'percentage'}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountValue" className="text-right">
                {newDiscount.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                step={newDiscount.discountType === 'percentage' ? "1" : "0.01"}
                min="0"
                max={newDiscount.discountType === 'percentage' ? "100" : undefined}
                value={newDiscount.discountValue || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minBookingHours" className="text-right">Min Hours</Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="minBookingHours"
                  name="minBookingHours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={newDiscount.minBookingHours || ''}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
                <span className="ml-2 text-sm text-muted-foreground">Optional</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validFrom" className="text-right">Valid From</Label>
              <Input
                id="validFrom"
                name="validFrom"
                type="date"
                value={newDiscount.validFrom || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validUntil" className="text-right">Valid Until</Label>
              <Input
                id="validUntil"
                name="validUntil"
                type="date"
                value={newDiscount.validUntil || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right">Usage Limit</Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  step="1"
                  min="0"
                  value={newDiscount.usageLimit || ''}
                  onChange={handleInputChange}
                  placeholder="Leave empty for unlimited"
                />
                <span className="ml-2 text-sm text-muted-foreground">Optional</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Status</Label>
              <div className="flex items-center col-span-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newDiscount.isActive}
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
              onClick={handleAddOrUpdateDiscount}
              className="ml-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              disabled={!newDiscount.code || !newDiscount.name}
            >
              {editingDiscount ? 'Update' : 'Add'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discounts;
