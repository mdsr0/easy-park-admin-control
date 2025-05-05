
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockComplaints } from '../data/mockData';
import { Complaint } from '../types';
import { MessageSquare, Edit, Trash2, MessageCircle, Eye } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');

  // Count complaints by status
  const pendingComplaints = complaints.filter(complaint => complaint.status === 'pending').length;
  const inProgressComplaints = complaints.filter(complaint => complaint.status === 'in-progress').length;
  const resolvedComplaints = complaints.filter(complaint => complaint.status === 'resolved').length;

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };

  const handleRespondToComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.response || '');
    setIsResponseDialogOpen(true);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  const handleSubmitResponse = () => {
    if (!selectedComplaint) return;
    
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === selectedComplaint.id 
        ? { 
            ...complaint, 
            response: response,
            status: 'resolved',
            resolvedAt: new Date().toISOString()
          } 
        : complaint
    );
    
    setComplaints(updatedComplaints);
    
    toast({
      title: "Response submitted",
      description: "The complaint has been marked as resolved",
    });
    
    setIsResponseDialogOpen(false);
    setSelectedComplaint(null);
    setResponse('');
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'in-progress' | 'resolved') => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { 
            ...complaint, 
            status,
            resolvedAt: status === 'resolved' ? new Date().toISOString() : complaint.resolvedAt
          } 
        : complaint
    ));
    
    toast({
      title: "Status updated",
      description: `Complaint status updated to ${status}`,
    });
  };

  const handleDeleteComplaint = (id: string) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
    toast({
      title: "Complaint deleted",
      description: "The complaint has been removed from the system"
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" /> User Complaints
        </h1>
        <p className="text-muted-foreground">Review and respond to user complaints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-yellow-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Pending</p>
          <p className="ep-stats-card-value">{pendingComplaints}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-blue-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">In Progress</p>
          <p className="ep-stats-card-value">{inProgressComplaints}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-green-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Resolved</p>
          <p className="ep-stats-card-value">{resolvedComplaints}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">{complaint.id}</TableCell>
                <TableCell>{complaint.customerName}</TableCell>
                <TableCell>{complaint.subject}</TableCell>
                <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {complaint.status === 'in-progress' ? 'In Progress' : 
                     complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    complaint.priority === 'low' ? 'bg-green-100 text-green-800' :
                    complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
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
                        <DropdownMenuItem onClick={() => handleViewComplaint(complaint)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRespondToComplaint(complaint)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          <span>Respond</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(complaint.id, 'pending')}
                          disabled={complaint.status === 'pending'}
                        >
                          <span className="mr-2 text-yellow-500">●</span>
                          <span>Mark Pending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(complaint.id, 'in-progress')}
                          disabled={complaint.status === 'in-progress'}
                        >
                          <span className="mr-2 text-blue-500">●</span>
                          <span>Mark In Progress</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
                          disabled={complaint.status === 'resolved'}
                        >
                          <span className="mr-2 text-green-500">●</span>
                          <span>Mark Resolved</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteComplaint(complaint.id)}
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

      {/* View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Complaint ID</h3>
                  <p>{selectedComplaint.id}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Created At</h3>
                  <p>{formatDate(selectedComplaint.createdAt)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Name</h3>
                    <p>{selectedComplaint.customerName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                    <p>{selectedComplaint.customerEmail}</p>
                  </div>
                  {selectedComplaint.bookingId && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Related Booking</h3>
                      <p>{selectedComplaint.bookingId}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Complaint Details</h3>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Subject</h3>
                  <p>{selectedComplaint.subject}</p>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                  <p className="bg-muted/30 p-3 rounded-md">{selectedComplaint.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedComplaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedComplaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedComplaint.status === 'in-progress' ? 'In Progress' : 
                      selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Priority</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedComplaint.priority === 'low' ? 'bg-green-100 text-green-800' :
                      selectedComplaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedComplaint.response && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Response</h3>
                  <div>
                    <p className="bg-blue-50 p-3 rounded-md">{selectedComplaint.response}</p>
                  </div>
                  {selectedComplaint.resolvedAt && (
                    <div className="mt-3">
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Resolved At</h3>
                      <p>{formatDate(selectedComplaint.resolvedAt)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Complaint</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Complaint</h3>
                <p className="bg-muted/30 p-3 rounded-md text-sm">{selectedComplaint.description}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={handleResponseChange}
                  rows={5}
                  placeholder="Type your response here..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsResponseDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitResponse}
              className="ml-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              disabled={!response.trim()}
            >
              Send & Resolve
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaints;
