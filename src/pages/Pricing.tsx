
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockPricingRules } from '../data/mockData';
import { PricingRule } from '../types';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Pricing = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(mockPricingRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    name: '',
    slotType: 'standard',
    timeStart: '08:00',
    timeEnd: '18:00',
    daysApplicable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    basePrice: 5.00,
    hourlyRate: 2.50,
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name === 'basePrice' || name === 'hourlyRate') {
      setNewRule(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else if (type === 'checkbox') {
      setNewRule(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewRule(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDayToggle = (day: string) => {
    setNewRule(prev => {
      const currentDays = prev.daysApplicable || [];
      if (currentDays.includes(day)) {
        return {
          ...prev,
          daysApplicable: currentDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          daysApplicable: [...currentDays, day]
        };
      }
    });
  };

  const handleAddOrUpdateRule = () => {
    if (editingRule) {
      // Update existing rule
      setPricingRules(pricingRules.map(rule => 
        rule.id === editingRule.id ? {...rule, ...newRule} : rule
      ));
      toast({
        title: "Pricing rule updated",
        description: `Rule "${newRule.name}" has been updated successfully`,
      });
    } else {
      // Add new rule
      const id = (Math.max(...pricingRules.map(r => parseInt(r.id))) + 1).toString();
      setPricingRules([...pricingRules, { id, ...newRule as PricingRule }]);
      toast({
        title: "Pricing rule added",
        description: `Rule "${newRule.name}" has been added successfully`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingRule(null);
    setNewRule({
      name: '',
      slotType: 'standard',
      timeStart: '08:00',
      timeEnd: '18:00',
      daysApplicable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      basePrice: 5.00,
      hourlyRate: 2.50,
      isActive: true,
    });
  };

  const handleEditRule = (rule: PricingRule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      slotType: rule.slotType,
      timeStart: rule.timeStart,
      timeEnd: rule.timeEnd,
      daysApplicable: [...rule.daysApplicable],
      basePrice: rule.basePrice,
      hourlyRate: rule.hourlyRate,
      isActive: rule.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== id));
    toast({
      title: "Pricing rule deleted",
      description: "The pricing rule has been removed from the system"
    });
  };

  const handleToggleStatus = (id: string) => {
    setPricingRules(pricingRules.map(rule => 
      rule.id === id ? {...rule, isActive: !rule.isActive} : rule
    ));
    
    const rule = pricingRules.find(r => r.id === id);
    toast({
      title: `Rule "${rule?.name}" ${!rule?.isActive ? 'activated' : 'deactivated'}`,
      description: `The pricing rule is now ${!rule?.isActive ? 'active' : 'inactive'}`
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <DollarSign className="mr-2" /> Pricing Management
          </h1>
          <p className="text-muted-foreground">Set and manage parking rates based on time, location, and demand</p>
        </div>
        <button 
          onClick={() => {
            setEditingRule(null);
            setNewRule({
              name: '',
              slotType: 'standard',
              timeStart: '08:00',
              timeEnd: '18:00',
              daysApplicable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              basePrice: 5.00,
              hourlyRate: 2.50,
              isActive: true,
            });
            setIsDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Rule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slot Type</TableHead>
              <TableHead>Time Period</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <span className="capitalize">{rule.slotType}</span>
                </TableCell>
                <TableCell>{rule.timeStart} - {rule.timeEnd}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.daysApplicable.map(day => (
                      <span key={day} className="px-1 py-0.5 bg-muted rounded text-xs">
                        {day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">Base: ${rule.basePrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Hourly: ${rule.hourlyRate.toFixed(2)}/hr</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(rule.id)}>
                          <span className="mr-2 h-4 w-4">
                            {rule.isActive ? '🔴' : '🟢'}
                          </span>
                          <span>{rule.isActive ? 'Deactivate' : 'Activate'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRule(rule.id)}
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
            <DialogTitle>{editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Rule Name</Label>
              <Input
                id="name"
                name="name"
                value={newRule.name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Weekend Special"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slotType" className="text-right">Slot Type</Label>
              <select
                id="slotType"
                name="slotType"
                value={newRule.slotType || 'standard'}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="handicapped">Handicapped</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeStart" className="text-right">Start Time</Label>
              <Input
                id="timeStart"
                name="timeStart"
                type="time"
                value={newRule.timeStart || '08:00'}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeEnd" className="text-right">End Time</Label>
              <Input
                id="timeEnd"
                name="timeEnd"
                type="time"
                value={newRule.timeEnd || '18:00'}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Days</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={newRule.daysApplicable?.includes(day) || false}
                      onChange={() => handleDayToggle(day)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor={`day-${day}`} className="text-sm font-normal">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basePrice" className="text-right">Base Price ($)</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={newRule.basePrice || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyRate" className="text-right">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                step="0.01"
                min="0"
                value={newRule.hourlyRate || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Status</Label>
              <div className="flex items-center col-span-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newRule.isActive}
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
              onClick={handleAddOrUpdateRule}
              className="ml-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              disabled={!newRule.name || !newRule.daysApplicable?.length}
            >
              {editingRule ? 'Update' : 'Add'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
