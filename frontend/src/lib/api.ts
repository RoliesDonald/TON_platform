/**
 * API service functions for vehicle rental company management
 * Handles all API communication with proper error handling and data transformation
 */

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Vehicle rental company data interfaces
export interface VehicleRentalCompany {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  businessDetails: {
    establishedYear: number;
    businessLicense: string;
    taxId: string;
    description?: string;
  };
  fleetInfo: {
    totalVehicles: number;
    vehicleTypes: string[];
    specialties: string[];
  };
  partnership: {
    status: "pending" | "active" | "inactive";
    contractStart: string;
    contractEnd: string;
    commissionRate: number;
    monthlyRevenue?: number;
    bankDetails?: {
      bankName?: string;
      bankAccount?: string;
    };
  };
  compliance: {
    certifications: string[];
    insurance?: {
      provider?: string;
      policyNumber?: string;
      expiryDate?: string;
    };
  };
  notes?: string;
  agreedToTerms: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form data interface (matches the frontend form)
export interface VehicleRentalCompanyFormData {
  // Basic Information
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;

  // Address
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  // Business Details
  establishedYear: string;
  businessLicense: string;
  taxId: string;
  description: string;

  // Fleet Information
  totalVehicles: string;
  vehicleTypes: string[];
  specialties: string[];

  // Partnership Details
  status: "pending" | "active" | "inactive";
  contractStart: string;
  contractEnd: string;
  commissionRate: string;

  // Financial Information
  monthlyRevenue: string;
  bankName: string;
  bankAccount: string;

  // Certifications & Compliance
  certifications: string[];
  insuranceProvider: string;
  insurancePolicy: string;
  insuranceExpiry: string;

  // Additional Information
  notes: string;
  agreedToTerms: boolean;
}

/**
 * Transforms form data to API format
 */
export const transformFormDataToApi = (
  formData: VehicleRentalCompanyFormData
): Omit<VehicleRentalCompany, "id" | "createdAt" | "updatedAt"> => {
  // Defensive programming to handle undefined or missing values
  const safeTrim = (value: string | undefined | null): string => (value ? value.trim() : "");
  const safeParseInt = (value: string | undefined | null): number => {
    const parsed = parseInt(value || "0");
    return isNaN(parsed) ? 0 : parsed;
  };
  const safeParseFloat = (value: string | undefined | null): number => {
    const parsed = parseFloat(value || "0");
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    name: safeTrim(formData?.name),
    contactPerson: safeTrim(formData?.contactPerson),
    email: safeTrim(formData?.email),
    phone: safeTrim(formData?.phone),
    website: safeTrim(formData?.website) || undefined,
    address: {
      street: safeTrim(formData?.address),
      city: safeTrim(formData?.city),
      state: safeTrim(formData?.state) || undefined,
      country: safeTrim(formData?.country) || "USA",
      postalCode: safeTrim(formData?.postalCode) || undefined,
    },
    businessDetails: {
      establishedYear: safeParseInt(formData?.establishedYear),
      businessLicense: safeTrim(formData?.businessLicense),
      taxId: safeTrim(formData?.taxId),
      description: safeTrim(formData?.description) || undefined,
    },
    fleetInfo: {
      totalVehicles: safeParseInt(formData?.totalVehicles),
      vehicleTypes: formData?.vehicleTypes || [],
      specialties: formData?.specialties || [],
    },
    partnership: {
      status: formData?.status || "pending",
      contractStart: formData?.contractStart || "",
      contractEnd: formData?.contractEnd || "",
      commissionRate: safeParseFloat(formData?.commissionRate),
      monthlyRevenue: formData?.monthlyRevenue ? safeParseFloat(formData.monthlyRevenue) : undefined,
      bankDetails: {
        bankName: safeTrim(formData?.bankName) || undefined,
        bankAccount: safeTrim(formData?.bankAccount) || undefined,
      },
    },
    compliance: {
      certifications: formData?.certifications || [],
      insurance: formData?.insuranceProvider
        ? {
            provider: safeTrim(formData.insuranceProvider),
            policyNumber: safeTrim(formData?.insurancePolicy) || undefined,
            expiryDate: formData?.insuranceExpiry || undefined,
          }
        : undefined,
    },
    notes: safeTrim(formData?.notes) || undefined,
    agreedToTerms: Boolean(formData?.agreedToTerms),
  };
};

/**
 * Generic API request function with error handling
 */
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    // Ensure proper URL construction
    const baseUrl = API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available (for authenticated requests)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // Check if we got HTML (likely a 404 page)
        if (errorText.includes("<!DOCTYPE html>") || errorText.includes("<html")) {
          throw new Error(`API endpoint not found. Please check the API route configuration.`);
        }
        errorData = { message: errorText };
      }

      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error("API Request Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

/**
 * Vehicle Rental Company API functions
 */
export const vehicleRentalApi = {
  /**
   * Register a new vehicle rental company
   */
  createCompany: async (
    formData: VehicleRentalCompanyFormData
  ): Promise<ApiResponse<VehicleRentalCompany>> => {
    const apiData = transformFormDataToApi(formData);

    return apiRequest<VehicleRentalCompany>("/api/vehicle-rental/companies", {
      method: "POST",
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Get all vehicle rental companies
   */
  getCompanies: async (): Promise<ApiResponse<VehicleRentalCompany[]>> => {
    return apiRequest<VehicleRentalCompany[]>("/api/vehicle-rental/companies");
  },

  /**
   * Get a specific vehicle rental company by ID
   */
  getCompany: async (id: string): Promise<ApiResponse<VehicleRentalCompany>> => {
    return apiRequest<VehicleRentalCompany>(`/api/vehicle-rental/companies/${id}`);
  },

  /**
   * Update an existing vehicle rental company
   */
  updateCompany: async (
    id: string,
    formData: VehicleRentalCompanyFormData
  ): Promise<ApiResponse<VehicleRentalCompany>> => {
    const apiData = transformFormDataToApi(formData);

    return apiRequest<VehicleRentalCompany>(`/api/vehicle-rental/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Delete a vehicle rental company
   */
  deleteCompany: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/api/vehicle-rental/companies/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Update company partnership status
   */
  updatePartnershipStatus: async (
    id: string,
    status: "pending" | "active" | "inactive"
  ): Promise<ApiResponse<VehicleRentalCompany>> => {
    return apiRequest<VehicleRentalCompany>(`/api/vehicle-rental/companies/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Search vehicle rental companies
   */
  searchCompanies: async (query: string): Promise<ApiResponse<VehicleRentalCompany[]>> => {
    return apiRequest<VehicleRentalCompany[]>(
      `/api/vehicle-rental/companies/search?q=${encodeURIComponent(query)}`
    );
  },
};

/**
 * Vehicle data interfaces
 */
export interface Vehicle {
  id: string;
  vehicleId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    category: "sedan" | "suv" | "truck" | "van" | "luxury" | "light-truck";
    plateNumber: string;
    vin: string;
    color: string;
    mileage: number;
  };
  specifications: {
    engine: string;
    transmission: "automatic" | "manual" | "cvt";
    fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
    seats: number;
    doors: number;
    features: string[];
  };
  rental: {
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    deposit: number;
    currency: string;
    available: boolean;
    availableFrom?: string;
    location: string;
    minimumRentalDays: number;
  };
  status: "available" | "rented" | "maintenance" | "reserved" | "unavailable";
  lastMaintenance: string;
  nextMaintenance: string;
  rating: number;
  rentalCount: number;
  createdAt: string;
  lastUpdated: string;
}

// Form data interface for vehicle registration (matches the frontend form)
export interface VehicleFormData {
  // Company Assignment
  companyId: string;

  // Basic Vehicle Information
  make: string;
  model: string;
  year: string;
  category: "sedan" | "suv" | "truck" | "van" | "luxury" | "light-truck";
  plateNumber: string;
  vin: string;
  color: string;
  mileage: string;

  // Vehicle Specifications
  engine: string;
  transmission: "automatic" | "manual" | "cvt";
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  seats: string;
  doors: string;
  features: string[];

  // Rental Information
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  deposit: string;
  currency: string;
  available: boolean;
  availableFrom: string;
  location: string;
  minimumRentalDays: string;

  // Maintenance Information
  lastMaintenance: string;
  nextMaintenance: string;

  // Performance
  rating: string;
}

/**
 * Transforms vehicle form data to API format
 */
export const transformVehicleFormDataToApi = (
  formData: VehicleFormData,
  companyName: string,
  companyLogo: string
): Omit<Vehicle, "id" | "createdAt" | "lastUpdated" | "rentalCount"> => {
  // Defensive programming to handle undefined or missing values
  const safeTrim = (value: string | undefined | null): string => (value ? value.trim() : "");
  const safeParseInt = (value: string | undefined | null): number => {
    const parsed = parseInt(value || "0");
    return isNaN(parsed) ? 0 : parsed;
  };
  const safeParseFloat = (value: string | undefined | null): number => {
    const parsed = parseFloat(value || "0");
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    vehicleId: `VH-${Date.now().toString().slice(-6)}`,
    companyId: safeTrim(formData?.companyId),
    companyName: safeTrim(companyName),
    companyLogo: safeTrim(companyLogo),
    vehicleInfo: {
      make: safeTrim(formData?.make),
      model: safeTrim(formData?.model),
      year: safeParseInt(formData?.year),
      category: formData?.category || "sedan",
      plateNumber: safeTrim(formData?.plateNumber),
      vin: safeTrim(formData?.vin),
      color: safeTrim(formData?.color),
      mileage: safeParseInt(formData?.mileage),
    },
    specifications: {
      engine: safeTrim(formData?.engine),
      transmission: formData?.transmission || "automatic",
      fuelType: formData?.fuelType || "gasoline",
      seats: safeParseInt(formData?.seats),
      doors: safeParseInt(formData?.doors),
      features: formData?.features || [],
    },
    rental: {
      dailyRate: safeParseFloat(formData?.dailyRate),
      weeklyRate: safeParseFloat(formData?.weeklyRate),
      monthlyRate: safeParseFloat(formData?.monthlyRate),
      deposit: safeParseFloat(formData?.deposit),
      currency: safeTrim(formData?.currency) || "USD",
      available: Boolean(formData?.available),
      availableFrom: formData?.availableFrom || undefined,
      location: safeTrim(formData?.location),
      minimumRentalDays: safeParseInt(formData?.minimumRentalDays),
    },
    status: "available", // Default status for new vehicles
    lastMaintenance: formData?.lastMaintenance || new Date().toISOString().split("T")[0],
    nextMaintenance:
      formData?.nextMaintenance ||
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    rating: safeParseFloat(formData?.rating) || 0.0,
  };
};

/**
 * Vehicle API service functions
 */
export const vehicleApi = {
  /**
   * Register a new vehicle
   */
  createVehicle: async (
    formData: VehicleFormData,
    companyName: string,
    companyLogo: string
  ): Promise<ApiResponse<Vehicle>> => {
    const apiData = transformVehicleFormDataToApi(formData, companyName, companyLogo);

    return apiRequest<Vehicle>("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Get all vehicles
   */
  getVehicles: async (): Promise<ApiResponse<Vehicle[]>> => {
    return apiRequest<Vehicle[]>("/api/vehicles");
  },

  /**
   * Get a specific vehicle by ID
   */
  getVehicle: async (id: string): Promise<ApiResponse<Vehicle>> => {
    return apiRequest<Vehicle>(`/api/vehicles/${id}`);
  },

  /**
   * Update an existing vehicle
   */
  updateVehicle: async (
    id: string,
    formData: VehicleFormData,
    companyName: string,
    companyLogo: string
  ): Promise<ApiResponse<Vehicle>> => {
    const apiData = transformVehicleFormDataToApi(formData, companyName, companyLogo);

    return apiRequest<Vehicle>(`/api/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });
  },

  /**
   * Delete a vehicle
   */
  deleteVehicle: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/api/vehicles/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Update vehicle status
   */
  updateVehicleStatus: async (
    id: string,
    status: "available" | "rented" | "maintenance" | "reserved" | "unavailable"
  ): Promise<ApiResponse<Vehicle>> => {
    return apiRequest<Vehicle>(`/api/vehicles/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Update vehicle availability
   */
  updateVehicleAvailability: async (
    id: string,
    available: boolean,
    availableFrom?: string
  ): Promise<ApiResponse<Vehicle>> => {
    return apiRequest<Vehicle>(`/api/vehicles/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available, availableFrom }),
    });
  },

  /**
   * Search vehicles
   */
  searchVehicles: async (query: string): Promise<ApiResponse<Vehicle[]>> => {
    return apiRequest<Vehicle[]>(`/api/vehicles/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get vehicles by company
   */
  getVehiclesByCompany: async (companyId: string): Promise<ApiResponse<Vehicle[]>> => {
    return apiRequest<Vehicle[]>(`/api/vehicles/company/${companyId}`);
  },
};

/**
 * Validation utilities for vehicle form data
 */
export const validateVehicle = (
  formData: VehicleFormData
): { isValid: boolean; errors: Partial<Record<keyof VehicleFormData, string>> } => {
  const errors: Partial<Record<keyof VehicleFormData, string>> = {};

  // Company Assignment
  if (!formData.companyId.trim()) errors.companyId = "Company selection is required";

  // Basic Vehicle Information
  if (!formData.make.trim()) errors.make = "Vehicle make is required";
  if (!formData.model.trim()) errors.model = "Vehicle model is required";
  if (!formData.year) {
    errors.year = "Year is required";
  } else if (
    isNaN(Number(formData.year)) ||
    Number(formData.year) < 1900 ||
    Number(formData.year) > new Date().getFullYear() + 1
  ) {
    errors.year = "Please enter a valid year";
  }
  if (!formData.plateNumber.trim()) errors.plateNumber = "License plate number is required";
  if (!formData.vin.trim()) {
    errors.vin = "VIN is required";
  } else if (formData.vin.length !== 17) {
    errors.vin = "VIN must be 17 characters long";
  }
  if (!formData.color.trim()) errors.color = "Color is required";
  if (!formData.mileage) {
    errors.mileage = "Mileage is required";
  } else if (isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
    errors.mileage = "Mileage must be a positive number";
  }

  // Vehicle Specifications
  if (!formData.engine.trim()) errors.engine = "Engine information is required";
  if (!formData.seats) {
    errors.seats = "Number of seats is required";
  } else if (isNaN(Number(formData.seats)) || Number(formData.seats) <= 0 || Number(formData.seats) > 12) {
    errors.seats = "Number of seats must be between 1 and 12";
  }
  if (!formData.doors) {
    errors.doors = "Number of doors is required";
  } else if (isNaN(Number(formData.doors)) || Number(formData.doors) <= 0 || Number(formData.doors) > 6) {
    errors.doors = "Number of doors must be between 1 and 6";
  }

  // Rental Information
  if (!formData.dailyRate) {
    errors.dailyRate = "Daily rate is required";
  } else if (isNaN(Number(formData.dailyRate)) || Number(formData.dailyRate) <= 0) {
    errors.dailyRate = "Daily rate must be a positive number";
  }
  if (!formData.weeklyRate) {
    errors.weeklyRate = "Weekly rate is required";
  } else if (isNaN(Number(formData.weeklyRate)) || Number(formData.weeklyRate) <= 0) {
    errors.weeklyRate = "Weekly rate must be a positive number";
  }
  if (!formData.monthlyRate) {
    errors.monthlyRate = "Monthly rate is required";
  } else if (isNaN(Number(formData.monthlyRate)) || Number(formData.monthlyRate) <= 0) {
    errors.monthlyRate = "Monthly rate must be a positive number";
  }
  if (!formData.deposit) {
    errors.deposit = "Deposit amount is required";
  } else if (isNaN(Number(formData.deposit)) || Number(formData.deposit) < 0) {
    errors.deposit = "Deposit must be a non-negative number";
  }
  if (!formData.location.trim()) errors.location = "Rental location is required";
  if (!formData.minimumRentalDays) {
    errors.minimumRentalDays = "Minimum rental days is required";
  } else if (isNaN(Number(formData.minimumRentalDays)) || Number(formData.minimumRentalDays) <= 0) {
    errors.minimumRentalDays = "Minimum rental days must be a positive number";
  }

  // Maintenance Information
  if (!formData.lastMaintenance) errors.lastMaintenance = "Last maintenance date is required";
  if (!formData.nextMaintenance) errors.nextMaintenance = "Next maintenance date is required";

  // Validate maintenance dates
  if (formData.lastMaintenance && formData.nextMaintenance) {
    const lastDate = new Date(formData.lastMaintenance);
    const nextDate = new Date(formData.nextMaintenance);
    if (nextDate <= lastDate) {
      errors.nextMaintenance = "Next maintenance date must be after last maintenance date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validation utilities for form data
 */
export const validateVehicleRentalCompany = (
  formData: VehicleRentalCompanyFormData
): { isValid: boolean; errors: Partial<Record<keyof VehicleRentalCompanyFormData, string>> } => {
  const errors: Partial<Record<keyof VehicleRentalCompanyFormData, string>> = {};

  // Basic Information
  if (!formData.name.trim()) errors.name = "Company name is required";
  if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person is required";
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }
  if (!formData.phone.trim()) errors.phone = "Phone number is required";

  // Address
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.city.trim()) errors.city = "City is required";
  if (!formData.country.trim()) errors.country = "Country is required";

  // Business Details
  if (!formData.establishedYear) {
    errors.establishedYear = "Established year is required";
  } else if (
    isNaN(Number(formData.establishedYear)) ||
    Number(formData.establishedYear) < 1900 ||
    Number(formData.establishedYear) > new Date().getFullYear()
  ) {
    errors.establishedYear = "Please enter a valid year";
  }
  if (!formData.businessLicense.trim()) errors.businessLicense = "Business license is required";
  if (!formData.taxId.trim()) errors.taxId = "Tax ID is required";

  // Fleet Information
  if (!formData.totalVehicles) {
    errors.totalVehicles = "Total vehicles is required";
  } else if (isNaN(Number(formData.totalVehicles)) || Number(formData.totalVehicles) <= 0) {
    errors.totalVehicles = "Total vehicles must be a positive number";
  }
  if (formData.vehicleTypes.length === 0) errors.vehicleTypes = "At least one vehicle type is required";

  // Partnership Details
  if (!formData.contractStart) errors.contractStart = "Contract start date is required";
  if (!formData.contractEnd) errors.contractEnd = "Contract end date is required";
  if (!formData.commissionRate) {
    errors.commissionRate = "Commission rate is required";
  } else if (
    isNaN(Number(formData.commissionRate)) ||
    Number(formData.commissionRate) < 0 ||
    Number(formData.commissionRate) > 100
  ) {
    errors.commissionRate = "Commission rate must be between 0 and 100";
  }

  // Validate contract dates
  if (formData.contractStart && formData.contractEnd) {
    const startDate = new Date(formData.contractStart);
    const endDate = new Date(formData.contractEnd);
    if (endDate <= startDate) {
      errors.contractEnd = "Contract end date must be after start date";
    }
  }

  // Terms
  if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms and conditions";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Mock API response for development/testing
 */
export const mockApiResponses = {
  createCompany: {
    success: true,
    data: {
      id: "mock-company-" + Date.now(),
      name: "Test Rental Company",
      contactPerson: "John Doe",
      email: "test@example.com",
      phone: "+1-555-0123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as VehicleRentalCompany,
    message: "Company created successfully",
  } as ApiResponse<VehicleRentalCompany>,

  getCompanies: {
    success: true,
    data: [
      {
        id: "mock-1",
        name: "Premium Fleet Rentals",
        contactPerson: "John Anderson",
        email: "contact@premiumfleet.com",
        phone: "+1-555-0123",
        address: {
          street: "123 Business Avenue",
          city: "New York",
          state: "NY",
          country: "USA",
          postalCode: "10001",
        },
        businessDetails: {
          establishedYear: 2015,
          businessLicense: "BL-12345678",
          taxId: "12-3456789",
        },
        fleetInfo: {
          totalVehicles: 150,
          vehicleTypes: ["SUVs", "Luxury Cars", "Electric Vehicles"],
          specialties: ["Luxury Vehicles", "Electric Vehicles"],
        },
        partnership: {
          status: "active" as const,
          contractStart: "2024-01-01",
          contractEnd: "2025-12-31",
          commissionRate: 15.5,
        },
        compliance: {
          certifications: ["ISO 9001", "AAA Certified"],
        },
        agreedToTerms: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
    ] as VehicleRentalCompany[],
    message: "Companies retrieved successfully",
  } as ApiResponse<VehicleRentalCompany[]>,
};
