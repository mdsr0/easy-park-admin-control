
import React from 'react';
import { mockReportData } from '../data/mockData';
import { FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const Reports = () => {
  const { 
    dailyRevenue, 
    weeklyOccupancy, 
    monthlyRevenue, 
    popularSlots, 
    bookingsOverTime,
    slotUtilization
  } = mockReportData;

  // Format data for charts
  const revenueData = dailyRevenue.map((revenue, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    value: revenue
  }));

  const occupancyData = weeklyOccupancy.map((rate, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    value: rate
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" /> Reports & Analytics
        </h1>
        <p className="text-muted-foreground">View detailed reports on parking usage, revenue, and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-easypark-500">
            <DollarSign className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Monthly Revenue</p>
          <p className="ep-stats-card-value">${monthlyRevenue.toFixed(2)}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-easypark-500">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Total Bookings This Week</p>
          <p className="ep-stats-card-value">{bookingsOverTime.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="ep-stats-card p-4">
          <div className="ep-stats-card-icon text-easypark-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="ep-stats-card-label">Average Occupancy</p>
          <p className="ep-stats-card-value">
            {Math.round(weeklyOccupancy.reduce((sum, rate) => sum + rate, 0) / weeklyOccupancy.length)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
          <div className="h-64">
            <ChartContainer
              config={{
                revenue: { color: "#1a56db" },
              }}
            >
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<ChartTooltipContent nameKey="day" />} />
                <Bar dataKey="value" name="revenue" fill="var(--color-revenue, #1a56db)" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Weekly Occupancy Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Weekly Occupancy Rate</h2>
          <div className="h-64">
            <ChartContainer
              config={{
                occupancy: { color: "#10b981" },
              }}
            >
              <LineChart data={occupancyData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<ChartTooltipContent nameKey="day" />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="occupancy" 
                  stroke="var(--color-occupancy, #10b981)" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Slots */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Most Popular Slots</h2>
          <div className="h-64">
            <ChartContainer
              config={{
                popularity: { color: "#eab308" },
              }}
            >
              <BarChart 
                layout="vertical" 
                data={popularSlots} 
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Bar dataKey="bookings" name="popularity" fill="var(--color-popularity, #eab308)" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Slot Utilization by Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Slot Utilization by Section</h2>
          <div className="h-64 flex items-center justify-center">
            <ChartContainer
              config={{
                utilization: { color: "#8884d8" },
              }}
            >
              <PieChart width={300} height={300}>
                <Pie
                  data={slotUtilization}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="utilization"
                  nameKey="name"
                >
                  {slotUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
