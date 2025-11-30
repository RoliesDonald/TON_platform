/**
 * Next.js API Route for Company Vehicles
 * Handles GET operations for vehicles by company
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * GET /api/vehicles/company/[companyId] - Get vehicles by company ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;

    // Check if company exists
    const company = await dbHelpers.findCompanyById(companyId);
    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 }
      );
    }

    let vehicles = [];

    if (typeof dbHelpers.findVehiclesByCompany === 'function') {
      vehicles = await dbHelpers.findVehiclesByCompany(companyId);
    } else {
      // Fallback: filter mock data by company ID
      const mockVehicles = (global as any).mockVehicles || [];
      vehicles = mockVehicles.filter((vehicle: any) => vehicle.companyId === companyId);
    }

    return NextResponse.json({
      success: true,
      data: vehicles,
      message: `${vehicles.length} vehicles found for company ${company.name}`,
    });
  } catch (error) {
    console.error('Error fetching company vehicles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company vehicles',
      },
      { status: 500 }
    );
  }
}