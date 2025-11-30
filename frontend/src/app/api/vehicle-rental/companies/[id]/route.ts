/**
 * Next.js API Route for Individual Vehicle Rental Company Operations
 * Handles GET, PUT, DELETE operations for specific vehicle rental companies
 */

import { NextRequest, NextResponse } from 'next/server';
import { VehicleRentalCompany, VehicleRentalCompanyFormData } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';

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
 * GET /api/vehicle-rental/companies/[id]
 * Get a specific vehicle rental company by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await dbHelpers.findCompanyById(id);

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
      message: 'Company retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/vehicle-rental/companies/[id]
 * Update a specific vehicle rental company
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingCompany = await dbHelpers.findCompanyById(id);

    if (!existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 }
      );
    }

    const formData: VehicleRentalCompanyFormData = await request.json();
    const updatedCompanyData = transformFormData(formData);

    // Check if email conflicts with another company
    const emailConflict = await dbHelpers.findCompanyByEmail(formData.email);

    if (emailConflict && emailConflict.id !== id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Another company with this email already exists',
        },
        { status: 409 }
      );
    }

    // Update company
    const updatedCompany = await dbHelpers.updateCompany(id, {
      ...updatedCompanyData,
      id: id, // Ensure ID remains the same
      createdAt: existingCompany.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully',
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update company',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vehicle-rental/companies/[id]
 * Delete a specific vehicle rental company
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedCompany = await dbHelpers.deleteCompany(id);

    if (!deletedCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedCompany,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete company',
      },
      { status: 500 }
    );
  }
}