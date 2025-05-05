
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar,
  FileText,
  Settings,
  DollarSign,
  TicketPercent,
  MessageSquare, 
  ParkingSquare
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 1, label: 'Parking Slots', icon: <ParkingSquare className="w-5 h-5" />, path: '/' },
    { id: 2, label: 'Bookings', icon: <Calendar className="w-5 h-5" />, path: '/bookings' },
    { id: 3, label: 'Complaints', icon: <MessageSquare className="w-5 h-5" />, path: '/complaints' },
    { id: 4, label: 'Pricing', icon: <DollarSign className="w-5 h-5" />, path: '/pricing' },
    { id: 5, label: 'Discounts', icon: <TicketPercent className="w-5 h-5" />, path: '/discounts' },
    { id: 6, label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports' },
    { id: 7, label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center">
            <ParkingSquare className="w-6 h-6 mr-2 text-easypark-400" />
            <span>EasyPark</span>
          </h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Management System</p>
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent/50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center px-4 py-2 rounded-md">
            <div className="w-8 h-8 rounded-full bg-easypark-700 flex items-center justify-center text-white">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">admin@easypark.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
