/**
 * Next.js API Route for Company Status Updates
 * Handles PATCH operations for updating partnership status
 */

import { NextRequest, NextResponse } from 'next/server';
import { VehicleRentalCompany } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * PATCH /api/vehicle-rental/companies/[id]/status
 * Update partnership status of a specific vehicle rental company
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingCompany = dbHelpers.findCompanyById(id);

    if (!existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate status
    const validStatuses = ['pending', 'active', 'inactive'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: pending, active, inactive',
        },
        { status: 400 }
      );
    }

    // Update company status
    const updatedCompany = dbHelpers.updateCompany(id, {
      partnership: {
        ...existingCompany.partnership,
        status: body.status,
      },
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: `Company status updated to ${body.status} successfully`,
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update company status',
      },
      { status: 500 }
    );
  }
}