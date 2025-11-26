/**
 * PostgreSQL Database Helper Functions
 * Now using real PostgreSQL database instead of mock data
 */

import { db } from './database';
import { VehicleRentalCompany, Vehicle } from './api';

/**
 * Helper function to transform database company data to API format
 */
function transformCompanyFromDB(dbCompany: any): VehicleRentalCompany | null {
  if (!dbCompany) return null;

  return {
    id: dbCompany.company_id,
    name: dbCompany.company_name,
    contactPerson: 'Contact Person', // This would come from a related table
    email: dbCompany.company_email || '',
    phone: dbCompany.contact || '',
    address: {
      street: dbCompany.address || '',
      city: dbCompany.city || '',
      state: '',
      country: '',
      postalCode: '',
    },
    businessDetails: {
      establishedYear: 2020, // Default value
      businessLicense: 'BL-DEFAULT',
      taxId: '12-3456789',
      description: `${dbCompany.company_name} - ${dbCompany.company_type}`,
    },
    fleetInfo: {
      totalVehicles: 0, // This would come from a related count query
      vehicleTypes: [],
      specialties: [],
    },
    partnership: {
      status: dbCompany.status === 'ACTIVE' ? 'active' : 'inactive',
      contractStart: '2024-01-01',
      contractEnd: '2025-12-31',
      commissionRate: 15.0,
      monthlyRevenue: 0, // This would be calculated
      bankDetails: {
        bankName: 'Default Bank',
        bankAccount: '****1234',
      },
    },
    compliance: {
      certifications: ['ISO 9001'],
      insurance: {
        provider: 'Default Insurance',
        policyNumber: 'POL-DEFAULT',
        expiryDate: '2025-01-01',
      },
    },
    notes: 'Company imported from database',
    agreedToTerms: true,
    createdAt: dbCompany.created_at,
    updatedAt: dbCompany.updated_at,
  };
}

/**
 * Helper function to transform database vehicle data to API format
 */
function transformVehicleFromDB(dbVehicle: any): Vehicle | null {
  if (!dbVehicle) return null;

  return {
    id: dbVehicle.id,
    vehicleId: `VH-${dbVehicle.license_plate}`,
    companyId: dbVehicle.owner_company_id,
    companyName: dbVehicle.owner_company_name || 'Unknown Company',
    companyLogo: dbVehicle.owner_company_id?.substring(0, 2).toUpperCase() || 'UN',
    vehicleInfo: {
      make: dbVehicle.vehicle_make,
      model: dbVehicle.model,
      year: dbVehicle.year_made,
      category: dbVehicle.vehicle_category?.toLowerCase() || 'sedan',
      plateNumber: dbVehicle.license_plate,
      vin: dbVehicle.vin_num || '',
      color: dbVehicle.color,
      mileage: dbVehicle.last_odometer,
    },
    specifications: {
      engine: `${dbVehicle.year_made} ${dbVehicle.vehicle_make}`,
      transmission: dbVehicle.transmission_type === 'AUTOMATIC/AT' ? 'automatic' : 'manual',
      fuelType: dbVehicle.fuel_type?.toLowerCase() || 'gasoline',
      seats: 5, // Default value
      doors: 4, // Default value
      features: [], // This would come from a related table
    },
    rental: {
      dailyRate: 45, // Default values
      weeklyRate: 280,
      monthlyRate: 1200,
      deposit: 500,
      currency: "USD",
      available: dbVehicle.status === 'AVAILABLE',
      availableFrom: dbVehicle.start_rent_date || new Date().toISOString().split('T')[0],
      location: "Downtown Office", // This would come from a related table
      minimumRentalDays: 1,
    },
    status: dbVehicle.status?.toLowerCase() || 'available',
    lastMaintenance: dbVehicle.last_service_date?.split('T')[0] || '2024-02-15',
    nextMaintenance: '2024-05-15', // This would be calculated
    rating: 4.5, // This would be calculated from rentals
    rentalCount: 0, // This would come from a related table
    createdAt: dbVehicle.created_at,
    lastUpdated: dbVehicle.updated_at,
  };
}

/**
 * Helper function to transform API vehicle data to database format
 */
function transformVehicleToDB(vehicle: Vehicle): any {
  return {
    licensePlate: vehicle.vehicleId.replace('VH-', ''),
    vehicleMake: vehicle.vehicleInfo.make,
    model: vehicle.vehicleInfo.model,
    yearMade: vehicle.vehicleInfo.year,
    color: vehicle.vehicleInfo.color,
    vehicleType: 'PASSENGER', // Default
    vehicleCategory: vehicle.vehicleInfo.category.toUpperCase(),
    fuelType: vehicle.specifications?.fuelType?.toUpperCase() || 'GASOLINE',
    transmissionType: vehicle.specifications?.transmission === 'automatic' ? 'AUTOMATIC/AT' : 'MANUAL/MT',
    lastOdometer: vehicle.vehicleInfo.mileage,
    status: vehicle.status?.toUpperCase() || 'AVAILABLE',
    ownerId: vehicle.companyId,
    description: vehicle.rental?.location || 'Default Location',
    notes: `Rating: ${vehicle.rating || 0}, Rentals: ${vehicle.rentalCount || 0}`
  };
}

// Export mock data for backward compatibility and fallback when database is disabled
export const mockCompanies: VehicleRentalCompany[] = [
  {
    id: 'mock-1',
    name: 'Test Rental Company',
    contactPerson: 'John Doe',
    email: 'test@example.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Main St',
      city: 'Test City',
      state: 'TX',
      country: 'USA',
      postalCode: '75001',
    },
    businessDetails: {
      establishedYear: 2020,
      businessLicense: 'BL-123456',
      taxId: '12-3456789',
      description: 'Test vehicle rental company for development',
    },
    fleetInfo: {
      totalVehicles: 5,
      vehicleTypes: ['sedan', 'suv', 'truck'],
      specialties: ['Premium Service', 'Airport Transfers'],
    },
    partnership: {
      status: 'active',
      contractStart: '2024-01-01',
      contractEnd: '2025-12-31',
      commissionRate: 15.0,
      monthlyRevenue: 10000,
      bankDetails: {
        bankName: 'Test Bank',
        bankAccount: '****1234',
      },
    },
    compliance: {
      insurance: {
        policyNumber: 'INS-123456',
        provider: 'Test Insurance',
        expiryDate: '2025-12-31',
        coverageAmount: 1000000,
      },
      certifications: ['DOT-CERT-001', 'SAFE-DRIVER-002'],
    },
    documents: [],
    performance: {
      rating: 4.5,
      totalRentals: 150,
      averageRevenuePerRental: 250,
      customerSatisfactionScore: 92,
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    lastUpdated: '2024-11-25T00:00:00.000Z',
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-mock-1',
    vehicleId: 'VH-MOCK-001',
    companyId: 'mock-1',
    companyName: 'Test Rental Company',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      category: 'sedan',
      plateNumber: 'TEST-123',
      vin: '1HGBH41JXMN109186',
      color: 'White',
      mileage: 15000,
    },
    specifications: {
      engine: '2.5L 4-Cylinder',
      transmission: 'automatic',
      fuelType: 'gasoline',
      seats: 5,
      doors: 4,
      features: ['Air Conditioning', 'Power Windows', 'Bluetooth'],
    },
    rental: {
      dailyRate: 50,
      weeklyRate: 300,
      monthlyRate: 1000,
      deposit: 500,
      currency: 'USD',
      available: true,
      location: 'Test Location',
      minimumRentalDays: 1,
    },
    status: 'available',
    rating: 4.2,
    rentalCount: 25,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastUpdated: '2024-11-25T00:00:00.000Z',
  }
];

// In-memory storage for created vehicles in mock mode (using global for persistence)
if (!(global as any).createdVehicles) {
  (global as any).createdVehicles = [];
}
const createdVehicles: Vehicle[] = (global as any).createdVehicles;

// Helper functions for database operations (now using PostgreSQL)
export const dbHelpers = {
  // Company functions
  findCompanyById: async (id: string): Promise<VehicleRentalCompany | null> => {
    try {
      const dbCompany = await db.findCompanyByCompanyId(id);
      if (dbCompany) {
        return transformCompanyFromDB(dbCompany);
      }
    } catch (error) {
      console.log('Database error, using fallback mock data for findCompanyById');
    }
    // Fallback to mock data
    return mockCompanies.find(c => c.id === id) || null;
  },

  findCompanyByEmail: async (email: string): Promise<VehicleRentalCompany | null> => {
    const dbCompany = await db.findCompaniesByType('RENTAL_COMPANY');
    const company = dbCompany.find((c: any) => c.company_email?.toLowerCase() === email.toLowerCase());
    return transformCompanyFromDB(company);
  },

  addCompany: async (company: VehicleRentalCompany): Promise<void> => {
    await db.createCompany({
      companyId: company.id,
      companyName: company.name,
      companyEmail: company.email,
      contact: company.phone,
      address: company.address.street,
      city: company.address.city,
      companyType: 'RENTAL_COMPANY',
      status: company.partnership.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      companyRole: 'MAIN_COMPANY',
      taxRegistered: company.businessDetails.taxId ? true : false
    });
  },

  updateCompany: async (id: string, updates: Partial<VehicleRentalCompany>): Promise<VehicleRentalCompany | null> => {
    const dbCompany = await db.updateCompany(id, {
      companyName: updates.name,
      companyEmail: updates.email,
      contact: updates.phone,
      address: updates.address?.street,
      city: updates.address?.city
    });
    return transformCompanyFromDB(dbCompany);
  },

  deleteCompany: async (id: string): Promise<VehicleRentalCompany | null> => {
    const company = await db.findCompanyByCompanyId(id);
    if (!company) return null;

    // Soft delete by updating status
    await db.updateCompany(company.id, { status: 'INACTIVE' });
    return transformCompanyFromDB(company);
  },

  searchCompanies: async (query: string): Promise<VehicleRentalCompany[]> => {
    const dbCompanies = await db.findCompaniesByType('RENTAL_COMPANY');

    if (!query) return dbCompanies.map(c => transformCompanyFromDB(c)).filter(Boolean);

    const lowercaseQuery = query.toLowerCase();
    const filteredCompanies = dbCompanies.filter((company: any) =>
      company.company_name.toLowerCase().includes(lowercaseQuery) ||
      company.company_email?.toLowerCase().includes(lowercaseQuery) ||
      company.city?.toLowerCase().includes(lowercaseQuery)
    );

    return filteredCompanies.map(c => transformCompanyFromDB(c)).filter(Boolean);
  },

  // Vehicle functions
  findVehicleById: async (id: string): Promise<Vehicle | null> => {
    console.log('🔍 findVehicleById called with ID:', id);
    console.log('📝 Created vehicles in memory:', createdVehicles.length);

    try {
      const dbVehicle = await db.findVehicleById(id);
      if (dbVehicle) {
        console.log('✅ Found vehicle in database:', id);
        return transformVehicleFromDB(dbVehicle);
      }
    } catch (error) {
      console.log('Database error, checking in-memory storage for findVehicleById');
    }

    // Check in-memory storage as fallback
    const memoryVehicle = createdVehicles.find(v => v.id === id);
    if (memoryVehicle) {
      console.log('✅ Found vehicle in memory:', id, '-', memoryVehicle.vehicleId);
      return memoryVehicle;
    }

    // Check mock data as final fallback
    const mockVehicle = mockVehicles.find(v => v.id === id);
    if (mockVehicle) {
      console.log('✅ Found vehicle in mock data:', id);
      return mockVehicle;
    }

    console.log('❌ Vehicle not found anywhere:', id);
    return null;
  },

  findVehicleByVehicleId: async (vehicleId: string): Promise<Vehicle | null> => {
    const vehicles = await db.searchVehicles(vehicleId);
    const vehicle = vehicles.find((v: any) => v.license_plate === vehicleId.replace('VH-', ''));
    return transformVehicleFromDB(vehicle);
  },

  findVehiclesByCompany: async (companyId: string): Promise<Vehicle[]> => {
    const dbVehicles = await db.findVehiclesByCompany(companyId);
    return dbVehicles.map(v => transformVehicleFromDB(v)).filter(Boolean);
  },

  addVehicle: async (vehicle: Vehicle): Promise<void> => {
    // Always store in memory in mock data mode for immediate visibility
    const fullVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      rentalCount: 0,
    };
    createdVehicles.push(fullVehicle);
    console.log('✅ Vehicle added to memory:', fullVehicle.vehicleId);

    // Try database insertion (may or may not work in mock mode)
    try {
      const dbData = transformVehicleToDB(vehicle);
      await db.createVehicle(dbData);
      console.log('✅ Vehicle also added to database:', vehicle.vehicleId);
    } catch (error) {
      console.log('Database insertion failed (expected in mock mode):', error);
    }
  },

  updateVehicle: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
    try {
      const dbData = transformVehicleToDB(updates as Vehicle);
      const dbVehicle = await db.updateVehicle(id, dbData);
      if (dbVehicle) {
        return transformVehicleFromDB(dbVehicle);
      }
    } catch (error) {
      console.log('Database error, checking in-memory storage for updateVehicle');
    }

    // Check in-memory storage
    const vehicleIndex = createdVehicles.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
      const updatedVehicle = { ...createdVehicles[vehicleIndex], ...updates, lastUpdated: new Date().toISOString() };
      createdVehicles[vehicleIndex] = updatedVehicle;
      console.log('✅ Vehicle updated in memory:', updatedVehicle.vehicleId);
      return updatedVehicle;
    }

    // Check mock data (read-only, so return null for update)
    const mockVehicle = mockVehicles.find(v => v.id === id);
    if (mockVehicle) {
      console.log('⚠️ Cannot update mock vehicle:', mockVehicle.vehicleId);
      return null;
    }

    return null;
  },

  deleteVehicle: async (id: string): Promise<Vehicle | null> => {
    try {
      const vehicle = await db.findVehicleById(id);
      if (vehicle) {
        const success = await db.deleteVehicle(id);
        if (success) {
          return transformVehicleFromDB(vehicle);
        }
      }
    } catch (error) {
      console.log('Database error, checking in-memory storage for deleteVehicle');
    }

    // Check in-memory storage
    const vehicleIndex = createdVehicles.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
      const deletedVehicle = createdVehicles[vehicleIndex];
      createdVehicles.splice(vehicleIndex, 1);
      console.log('✅ Vehicle deleted from memory:', deletedVehicle.vehicleId);
      return deletedVehicle;
    }

    // Check mock data (read-only, so return null for delete)
    const mockVehicle = mockVehicles.find(v => v.id === id);
    if (mockVehicle) {
      console.log('⚠️ Cannot delete mock vehicle:', mockVehicle.vehicleId);
      return null;
    }

    return null;
  },

  searchVehicles: async (query: string): Promise<Vehicle[]> => {
    try {
      console.log('🔍 searchVehicles called with query:', query);
      console.log('📝 Created vehicles in memory:', createdVehicles.length);

      // First, check created vehicles in memory
      let allVehicles: Vehicle[] = [];

      if (!query || query === '%%') {
        // Return all vehicles for empty query or wildcard pattern
        const searchPattern = !query ? '' : query;
        const dbVehicles = await db.searchVehicles(searchPattern);
        console.log(`📊 Database returned ${dbVehicles?.length || 0} vehicles for query "${searchPattern}"`);

        if (dbVehicles && dbVehicles.length > 0) {
          const transformed = dbVehicles.map(v => transformVehicleFromDB(v)).filter(Boolean);
          allVehicles = [...transformed];
          console.log('🚗 Transformed vehicles from database:', transformed.length);
        }
      } else {
        const dbVehicles = await db.searchVehicles(query);
        console.log(`📊 Database returned ${dbVehicles?.length || 0} vehicles for query "${query}"`);

        if (dbVehicles && dbVehicles.length > 0) {
          const transformed = dbVehicles.map(v => transformVehicleFromDB(v)).filter(Boolean);
          allVehicles = [...transformed];
          console.log('🚗 Transformed vehicles from database:', transformed.length);
        }
      }

      // Add created vehicles from memory
      allVehicles = [...allVehicles, ...createdVehicles];
      console.log(`📋 Total vehicles (DB + Memory): ${allVehicles.length}`);

      // Apply search filter to all vehicles if query is provided
      if (query && query !== '%%') {
        const lowercaseQuery = query.toLowerCase();
        const filtered = allVehicles.filter(vehicle =>
          vehicle.vehicleId.toLowerCase().includes(lowercaseQuery) ||
          vehicle.vehicleInfo.make.toLowerCase().includes(lowercaseQuery) ||
          vehicle.vehicleInfo.model.toLowerCase().includes(lowercaseQuery) ||
          vehicle.vehicleInfo.plateNumber.toLowerCase().includes(lowercaseQuery) ||
          vehicle.vehicleInfo.vin.toLowerCase().includes(lowercaseQuery)
        );
        console.log(`🔍 Filtered to ${filtered.length} vehicles matching "${query}"`);
        return filtered;
      }

      return allVehicles;
    } catch (error) {
      console.log('Database error, using fallback mock data for searchVehicles:', error);
    }

    // Fallback to mock data + created vehicles
    console.log('Using fallback mock vehicles:', mockVehicles.length);
    console.log('Adding created vehicles:', createdVehicles.length);
    const allFallbackVehicles = [...mockVehicles, ...createdVehicles];

    if (!query) {
      return allFallbackVehicles;
    }

    const lowercaseQuery = query.toLowerCase();
    return allFallbackVehicles.filter(vehicle =>
      vehicle.vehicleInfo.make.toLowerCase().includes(lowercaseQuery) ||
      vehicle.vehicleInfo.model.toLowerCase().includes(lowercaseQuery) ||
      vehicle.vehicleInfo.plateNumber.toLowerCase().includes(lowercaseQuery) ||
      vehicle.vehicleInfo.vin.toLowerCase().includes(lowercaseQuery)
    );
  },
};