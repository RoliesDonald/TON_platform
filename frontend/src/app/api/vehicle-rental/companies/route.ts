/**
 * Next.js API Route for Vehicle Rental Companies
 * Handles CRUD operations for vehicle rental company management
 */

import { NextRequest, NextResponse } from 'next/server';
import { VehicleRentalCompany, VehicleRentalCompanyFormData } from '@/lib/api';
import { mockCompanies, dbHelpers } from '@/lib/mockDatabase';

/**
 * Helper function to transform form data to VehicleRentalCompany
 */
const transformFormData = (formData: VehicleRentalCompanyFormData): Omit<VehicleRentalCompany, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    name: formData.name.trim(),
    contactPerson: formData.contactPerson.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    website: formData.website.trim() || undefined,
    address: {
      street: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim() || undefined,
      country: formData.country.trim(),
      postalCode: formData.postalCode.trim() || undefined,
    },
    businessDetails: {
      establishedYear: parseInt(formData.establishedYear),
      businessLicense: formData.businessLicense.trim(),
      taxId: formData.taxId.trim(),
      description: formData.description.trim() || undefined,
    },
    fleetInfo: {
      totalVehicles: parseInt(formData.totalVehicles),
      vehicleTypes: formData.vehicleTypes,
      specialties: formData.specialties,
    },
    partnership: {
      status: formData.status,
      contractStart: formData.contractStart,
      contractEnd: formData.contractEnd,
      commissionRate: parseFloat(formData.commissionRate),
      monthlyRevenue: formData.monthlyRevenue ? parseFloat(formData.monthlyRevenue) : undefined,
      bankDetails: {
        bankName: formData.bankName.trim() || undefined,
        bankAccount: formData.bankAccount.trim() || undefined,
      },
    },
    compliance: {
      certifications: formData.certifications,
      insurance: formData.insuranceProvider ? {
        provider: formData.insuranceProvider.trim(),
        policyNumber: formData.insurancePolicy.trim() || undefined,
        expiryDate: formData.insuranceExpiry || undefined,
      } : undefined,
    },
    notes: formData.notes.trim() || undefined,
    agreedToTerms: formData.agreedToTerms,
  };
};

/**
 * GET /api/vehicle-rental/companies
 * Get all vehicle rental companies
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let companies = search ? await dbHelpers.searchCompanies(search) : mockCompanies;

    return NextResponse.json({
      success: true,
      data: companies,
      message: `${companies.length} companies retrieved successfully`,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vehicle-rental/companies
 * Create a new vehicle rental company
 */
export async function POST(request: NextRequest) {
  try {
    const formData: VehicleRentalCompanyFormData = await request.json();

    // Basic validation
    if (!formData.name || !formData.email || !formData.contactPerson) {
      return NextResponse.json(
        {
          success: false,
          error: 'Required fields are missing: name, email, contactPerson',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCompany = await dbHelpers.findCompanyByEmail(formData.email);

    if (existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'A company with this email already exists',
        },
        { status: 409 }
      );
    }

    // Create new company
    const newCompanyData = transformFormData(formData);
    const newCompany: VehicleRentalCompany = {
      ...newCompanyData,
      id: `company-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    await dbHelpers.addCompany(newCompany);

    return NextResponse.json({
      success: true,
      data: newCompany,
      message: 'Company created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company',
      },
      { status: 500 }
    );
  }
}