"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Wrench,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mechanic: {
    id: string;
    name: string;
    specialization: string;
    employeeId: string;
  };
  workOrder: {
    id: string;
    workOrderNumber: string;
    title: string;
    vehicle: {
      plateNumber: string;
      make: string;
      model: string;
    };
    customer: {
      name: string;
      company: string;
    };
    priority: "low" | "medium" | "high" | "urgent";
  } | null;
  type: "work" | "break" | "meeting" | "training" | "leave";
  location: {
    workshop: string;
    bay?: string;
  };
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

interface TimeSlot {
  time: string;
  date: string;
  availableMechanics: number;
  totalMechanics: number;
  workloadPercentage: number;
}

const mockScheduleData: ScheduleItem[] = [
  {
    id: "1",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "10:00",
    mechanic: {
      id: "1",
      name: "Mike Johnson",
      specialization: "Engine Specialist",
      employeeId: "MECH-001",
    },
    workOrder: {
      id: "1",
      workOrderNumber: "WO-2024-001",
      title: "Oil Change and Filter Replacement",
      vehicle: {
        plateNumber: "B-1234-ABC",
        make: "Toyota",
        model: "Camry",
      },
      customer: {
        name: "John Smith",
        company: "Fleet Logistics Inc.",
      },
      priority: "medium",
    },
    type: "work",
    location: {
      workshop: "Main Workshop",
      bay: "A-3",
    },
    status: "scheduled",
    notes: "Customer requested synthetic oil",
  },
  {
    id: "2",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "10:30",
    mechanic: {
      id: "1",
      name: "Mike Johnson",
      specialization: "Engine Specialist",
      employeeId: "MECH-001",
    },
    workOrder: null,
    type: "break",
    location: {
      workshop: "Main Workshop",
    },
    status: "scheduled",
  },
  {
    id: "3",
    date: "2024-01-15",
    startTime: "10:30",
    endTime: "12:30",
    mechanic: {
      id: "2",
      name: "David Chen",
      specialization: "Brake Specialist",
      employeeId: "MECH-002",
    },
    workOrder: {
      id: "2",
      workOrderNumber: "WO-2024-002",
      title: "Brake Pad Replacement",
      vehicle: {
        plateNumber: "C-5678-DEF",
        make: "Honda",
        model: "CR-V",
      },
      customer: {
        name: "Sarah Wilson",
        company: "Rental Cars Ltd.",
      },
      priority: "high",
    },
    type: "work",
    location: {
      workshop: "Main Workshop",
      bay: "B-1",
    },
    status: "in_progress",
  },
  {
    id: "4",
    date: "2024-01-15",
    startTime: "13:00",
    endTime: "15:00",
    mechanic: {
      id: "1",
      name: "Mike Johnson",
      specialization: "Engine Specialist",
      employeeId: "MECH-001",
    },
    workOrder: {
      id: "3",
      workOrderNumber: "WO-2024-006",
      title: "Engine Diagnostics",
      vehicle: {
        plateNumber: "G-3456-PQR",
        make: "Honda",
        model: "Accord",
      },
      customer: {
        name: "Robert Brown",
        company: "Delivery Services Co.",
      },
      priority: "urgent",
    },
    type: "work",
    location: {
      workshop: "Main Workshop",
      bay: "A-3",
    },
    status: "scheduled",
  },
  {
    id: "5",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "17:00",
    mechanic: {
      id: "4",
      name: "Carlos Rodriguez",
      specialization: "Transmission Specialist",
      employeeId: "MECH-004",
    },
    workOrder: {
      id: "4",
      workOrderNumber: "WO-2024-004",
      title: "Transmission Service",
      vehicle: {
        plateNumber: "E-3456-JKL",
        make: "Nissan",
        model: "Altima",
      },
      customer: {
        name: "Lisa Anderson",
        company: "Corporate Fleet",
      },
      priority: "medium",
    },
    type: "work",
    location: {
      workshop: "Main Workshop",
      bay: "D-1",
    },
    status: "scheduled",
  },
  {
    id: "6",
    date: "2024-01-16",
    startTime: "09:00",
    endTime: "11:00",
    mechanic: {
      id: "2",
      name: "David Chen",
      specialization: "Brake Specialist",
      employeeId: "MECH-002",
    },
    workOrder: null,
    type: "training",
    location: {
      workshop: "Training Room",
    },
    status: "scheduled",
    notes: "New brake system training",
  },
  {
    id: "7",
    date: "2024-01-16",
    startTime: "08:00",
    endTime: "17:00",
    mechanic: {
      id: "3",
      name: "Tom Wilson",
      specialization: "General Maintenance",
      employeeId: "MECH-003",
    },
    workOrder: null,
    type: "leave",
    location: {
      workshop: "Main Workshop",
    },
    status: "scheduled",
    notes: "Annual leave",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "work":
      return "bg-blue-100 text-blue-800";
    case "break":
      return "bg-green-100 text-green-800";
    case "meeting":
      return "bg-purple-100 text-purple-800";
    case "training":
      return "bg-orange-100 text-orange-800";
    case "leave":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
};

export default function WorkshopSchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(mockScheduleData);
  const [filteredItems, setFilteredItems] = useState<ScheduleItem[]>(mockScheduleData);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [mechanicFilter, setMechanicFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const mechanics = ["Mike Johnson", "David Chen", "Carlos Rodriguez"];

    for (let hour = 8; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const availableMechanics = Math.floor(Math.random() * mechanics.length) + 1;
      const totalMechanics = mechanics.length;

      slots.push({
        time,
        date,
        availableMechanics,
        totalMechanics,
        workloadPercentage: ((totalMechanics - availableMechanics) / totalMechanics) * 100,
      });
    }

    return slots;
  };

  useEffect(() => {
    let filtered = scheduleItems;

    if (selectedDate) {
      filtered = filtered.filter((item) => item.date === selectedDate);
    }

    if (mechanicFilter !== "all") {
      filtered = filtered.filter((item) => item.mechanic.id === mechanicFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    setFilteredItems(filtered);
  }, [scheduleItems, selectedDate, mechanicFilter, typeFilter]);

  const stats = {
    total: scheduleItems.length,
    today: scheduleItems.filter((item) => item.date === new Date().toISOString().split('T')[0]).length,
    inProgress: scheduleItems.filter((item) => item.status === "in_progress").length,
    completed: scheduleItems.filter((item) => item.status === "completed").length,
    scheduled: scheduleItems.filter((item) => item.status === "scheduled").length,
  };

  const uniqueMechanics = scheduleItems.reduce((acc, item) => {
    if (!acc.some(mech => mech.id === item.mechanic.id)) {
      acc.push(item.mechanic);
    }
    return acc;
  }, [] as typeof scheduleItems[0]['mechanic'][]);

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    const days = viewMode === "day" ? 1 : viewMode === "week" ? 7 : 30;

    if (direction === "next") {
      currentDate.setDate(currentDate.getDate() + days);
    } else {
      currentDate.setDate(currentDate.getDate() - days);
    }

    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workshop Schedule</h1>
          <p className="text-muted-foreground">Manage mechanic schedules and work assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Navigation */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[150px]"
          />
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
        </div>

        <div className="flex-1 lg:flex-none lg:w-[200px]">
          <Select value={mechanicFilter} onValueChange={setMechanicFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter mechanic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mechanics</SelectItem>
              {uniqueMechanics.map((mechanic) => (
                <SelectItem key={mechanic.id} value={mechanic.id}>
                  {mechanic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:w-[150px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="break">Break</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Slots and Schedule Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Schedule for {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generateTimeSlots(selectedDate).map((slot) => (
                  <div
                    key={slot.time}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {slot.availableMechanics}/{slot.totalMechanics} available
                        </span>
                      </div>
                    </div>

                    {/* Schedule Items for this time slot */}
                    <div className="space-y-2">
                      {filteredItems
                        .filter((item) => item.date === selectedDate && item.startTime <= slot.time && item.endTime > slot.time)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`border-l-4 p-2 rounded-r-lg ${
                              item.type === "work" ? "border-blue-500 bg-blue-50" :
                              item.type === "break" ? "border-green-500 bg-green-50" :
                              item.type === "meeting" ? "border-purple-500 bg-purple-50" :
                              item.type === "training" ? "border-orange-500 bg-orange-50" :
                              "border-gray-500 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge className={getTypeColor(item.type)} variant="outline">
                                  {item.type}
                                </Badge>
                                <Badge className={getStatusColor(item.status)} variant="outline">
                                  {item.status}
                                </Badge>
                              </div>
                              <Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => {
                                        e.preventDefault();
                                        setSelectedItem(item);
                                      }}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Schedule Item Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedItem && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-semibold mb-2">Time & Duration</h4>
                                          <div className="bg-muted p-3 rounded-lg space-y-1">
                                            <p><span className="font-medium">Date:</span> {new Date(selectedItem.date).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Start:</span> {selectedItem.startTime}</p>
                                            <p><span className="font-medium">End:</span> {selectedItem.endTime}</p>
                                            <p><span className="font-medium">Type:</span> <Badge className={getTypeColor(selectedItem.type)}>{selectedItem.type}</Badge></p>
                                            <p><span className="font-medium">Status:</span> <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge></p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">Mechanic</h4>
                                          <div className="bg-muted p-3 rounded-lg space-y-1">
                                            <p><span className="font-medium">Name:</span> {selectedItem.mechanic.name}</p>
                                            <p><span className="font-medium">ID:</span> {selectedItem.mechanic.employeeId}</p>
                                            <p><span className="font-medium">Specialization:</span> {selectedItem.mechanic.specialization}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="font-semibold mb-2">Location</h4>
                                        <div className="bg-muted p-3 rounded-lg">
                                          <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{selectedItem.location.workshop}</span>
                                            {selectedItem.location.bay && (
                                              <span> - Bay {selectedItem.location.bay}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {selectedItem.workOrder && (
                                        <div>
                                          <h4 className="font-semibold mb-2">Work Order</h4>
                                          <div className="bg-muted p-3 rounded-lg space-y-1">
                                            <p><span className="font-medium">WO#:</span> {selectedItem.workOrder.workOrderNumber}</p>
                                            <p><span className="font-medium">Title:</span> {selectedItem.workOrder.title}</p>
                                            <p><span className="font-medium">Vehicle:</span> {selectedItem.workOrder.vehicle.make} {selectedItem.workOrder.vehicle.model} ({selectedItem.workOrder.vehicle.plateNumber})</p>
                                            <p><span className="font-medium">Customer:</span> {selectedItem.workOrder.customer.name} - {selectedItem.workOrder.customer.company}</p>
                                            <p><span className="font-medium">Priority:</span> <Badge variant={getPriorityColor(selectedItem.workOrder.priority)}>{selectedItem.workOrder.priority}</Badge></p>
                                          </div>
                                        </div>
                                      )}

                                      {selectedItem.notes && (
                                        <div>
                                          <h4 className="font-semibold mb-2">Notes</h4>
                                          <div className="bg-muted p-3 rounded-lg">
                                            <p>{selectedItem.notes}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="mt-2">
                              <div className="font-medium">{item.mechanic.name}</div>
                              <div className="text-sm text-muted-foreground">{item.mechanic.specialization}</div>
                              {item.workOrder && (
                                <div className="text-sm">
                                  <span className="font-medium">{item.workOrder.workOrderNumber}:</span> {item.workOrder.title}
                                </div>
                              )}
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {item.location.workshop} {item.location.bay && `(Bay ${item.location.bay})`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Scheduled</span>
                  <span className="text-sm font-bold">{filteredItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Work Orders</span>
                  <span className="text-sm font-bold">
                    {filteredItems.filter(item => item.type === "work").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">In Progress</span>
                  <span className="text-sm font-bold">
                    {filteredItems.filter(item => item.status === "in_progress").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm font-bold">
                    {filteredItems.filter(item => item.status === "completed").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Mechanics */}
          <Card>
            <CardHeader>
              <CardTitle>Active Mechanics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uniqueMechanics.map((mechanic) => {
                  const mechanicItems = filteredItems.filter(item => item.mechanic.id === mechanic.id);
                  const activeCount = mechanicItems.filter(item => item.status === "in_progress").length;

                  return (
                    <div key={mechanic.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <div className="font-medium">{mechanic.name}</div>
                        <div className="text-sm text-muted-foreground">{mechanic.specialization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{mechanicItems.length} items</div>
                        {activeCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {activeCount} active
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Work Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Assign Mechanic
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Break
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}