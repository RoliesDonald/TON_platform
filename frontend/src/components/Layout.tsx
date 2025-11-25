"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Users,
  Truck,
  FileText,
  Settings,
  MapPin,
  DollarSign,
  Wrench,
  LogOut,
  User as UserIcon,
  Shield,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "manager", "accountant", "service_advisor", "mechanic", "driver"],
  },
  {
    title: "Vehicle Tracking",
    href: "/dashboard/tracking",
    icon: MapPin,
    roles: ["manager", "service_advisor"],
    badge: "Live",
  },
  {
    title: "Fleet Management",
    href: "/dashboard/fleet",
    icon: Truck,
    roles: ["admin", "manager", "service_advisor"],
    children: [
      {
        title: "Vehicle List",
        href: "/dashboard/fleet/vehicles",
        icon: Truck,
        roles: ["admin", "manager", "service_advisor"],
      },
      {
        title: "Vehicle Status",
        href: "/dashboard/fleet/status",
        icon: Settings,
        roles: ["admin", "manager", "service_advisor"],
      },
      {
        title: "Maintenance Schedule",
        href: "/dashboard/fleet/maintenance",
        icon: Wrench,
        roles: ["admin", "manager", "service_advisor"],
      },
    ],
  },
  {
    title: "Work Orders",
    href: "/dashboard/workorders",
    icon: Wrench,
    roles: ["admin", "manager", "service_advisor", "mechanic"],
    children: [
      {
        title: "Active Work Orders",
        href: "/dashboard/workorders/active",
        icon: Wrench,
        roles: ["admin", "manager", "service_advisor", "mechanic"],
      },
      {
        title: "Create Work Order",
        href: "/dashboard/workorders/create",
        icon: FileText,
        roles: ["admin", "manager", "service_advisor"],
      },
      {
        title: "Work Order History",
        href: "/dashboard/workorders/history",
        icon: Settings,
        roles: ["admin", "manager", "service_advisor", "mechanic"],
      },
    ],
  },
  {
    title: "Invoicing & Billing",
    href: "/dashboard/invoicing",
    icon: FileText,
    roles: ["admin", "accountant", "manager"],
    children: [
      {
        title: "All Invoices",
        href: "/dashboard/invoicing",
        icon: FileText,
        roles: ["admin", "accountant", "manager"],
      },
      {
        title: "Create Invoice",
        href: "/dashboard/invoicing/create",
        icon: DollarSign,
        roles: ["admin", "accountant"],
      },
      {
        title: "Payment Links",
        href: "/dashboard/invoicing/payment-links",
        icon: DollarSign,
        roles: ["admin", "accountant"],
      },
      {
        title: "Quotations",
        href: "/dashboard/invoicing/quotations",
        icon: Settings,
        roles: ["admin", "accountant", "manager"],
      },
      {
        title: "Payment History",
        href: "/dashboard/invoicing/payment-history",
        icon: Settings,
        roles: ["admin", "accountant", "manager"],
      },
    ],
  },
  {
    title: "Inventory Management",
    href: "/dashboard/inventory",
    icon: Truck,
    roles: ["admin", "manager", "service_advisor"],
    children: [
      {
        title: "Parts Inventory",
        href: "/dashboard/inventory/parts",
        icon: Truck,
        roles: ["admin", "manager", "service_advisor"],
      },
      {
        title: "Stock Levels",
        href: "/dashboard/inventory/stock",
        icon: Settings,
        roles: ["admin", "manager"],
      },
      {
        title: "Suppliers",
        href: "/dashboard/inventory/suppliers",
        icon: Users,
        roles: ["admin", "manager"],
      },
      {
        title: "Purchase Order",
        href: "/dashboard/inventory/purchase-orders",
        icon: ShoppingBag,
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    title: "Reports & Analytics",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["admin", "manager", "accountant"],
    children: [
      {
        title: "Fleet Performance",
        href: "/dashboard/reports/fleet",
        icon: Truck,
        roles: ["admin", "manager"],
      },
      {
        title: "Financial Reports",
        href: "/dashboard/reports/financial",
        icon: DollarSign,
        roles: ["admin", "manager", "accountant"],
      },
      {
        title: "Maintenance Reports",
        href: "/dashboard/reports/maintenance",
        icon: Wrench,
        roles: ["admin", "manager", "service_advisor"],
      },
    ],
  },
  {
    title: "User Management",
    href: "/dashboard/user-management",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "System Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin"],
    children: [
      {
        title: "Units",
        href: "/dashboard/settings/units",
        icon: Settings,
        roles: ["admin"],
      },
    ],
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't render layout for login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const filteredNavigation = navigationItems.filter((item) => user?.role && item.roles.includes(user.role));

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    const itemContent = (
      <div
        className={`flex items-center justify-between w-full ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{item.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren &&
            (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </div>
      </div>
    );

    if (hasChildren) {
      return (
        <div key={item.title} className="w-full">
          <Button
            variant="ghost"
            className={`w-full justify-start h-10 ${isActive ? "bg-muted" : ""}`}
            onClick={() => toggleExpanded(item.title)}
          >
            {itemContent}
          </Button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item
                .children!.filter((child) => user?.role && child.roles.includes(user.role))
                .map((child) => renderNavigationItem(child, isMobile))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={item.title} href={item.href}>
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 ${isActive ? "bg-muted" : ""}`}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          {itemContent}
        </Button>
      </Link>
    );
  };

  // Don't render layout for login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">TON Platform</h1>
        <p className="text-sm text-muted-foreground capitalize">{user?.role} Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <TooltipProvider>{filteredNavigation.map((item) => renderNavigationItem(item))}</TooltipProvider>
      </nav>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-6 w-6 mr-3">
                <AvatarFallback>{user?.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col border-r bg-card">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">TON Platform</h1>
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role}
              </Badge>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.avatar}</AvatarFallback>
            </Avatar>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
