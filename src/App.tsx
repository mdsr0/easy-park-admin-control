
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ParkingSlots from "./pages/ParkingSlots";
import Bookings from "./pages/Bookings";
import Complaints from "./pages/Complaints";
import Pricing from "./pages/Pricing";
import Discounts from "./pages/Discounts";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ParkingSlots />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
