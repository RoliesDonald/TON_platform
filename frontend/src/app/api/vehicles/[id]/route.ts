/**
 * Next.js API Route for Individual Vehicle Operations
 * Handles GET, PUT, and DELETE operations for specific vehicles
 */

import { NextRequest, NextResponse } from 'next/server';
import { Vehicle } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';
import { db } from '@/lib/database';

// Helper function to validate user and extract company info
function validateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { error: 'Authentication required', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  let userCompany = null;
  let isAdmin = false;

  // Mock user validation - in a real app, validate the JWT token
  if (token.includes('admin')) {
    isAdmin = true;
  } else if (token.includes('rental') || token.includes('company')) {
    // Mock user with company access
    userCompany = 'mock-1'; // This would come from the decoded JWT
  }

  return { userCompany, isAdmin };
}

/**
 * GET /api/vehicles/[id] - Get a specific vehicle by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vehicle = typeof dbHelpers.findVehicleById === 'function'
      ? await dbHelpers.findVehicleById(id)
      : (global as any).mockVehicles?.find((v: Vehicle) => v.id === id);

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vehicle not found',
        },
        { status: 404 }
      );
    }

    // RBAC validation - user must be authenticated to view vehicle details
    const authValidation = validateUser(request);
    if (authValidation.error) {
      return NextResponse.json(
        {
          success: false,
          error: authValidation.error,
        },
        { status: authValidation.status }
      );
    }

    // Non-admin users can only view their own company vehicles
    if (!authValidation.isAdmin && authValidation.userCompany &&
        vehicle.companyId !== authValidation.userCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: You can only view your own company vehicles',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: 'Vehicle retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vehicle',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/vehicles/[id] - Update an existing vehicle
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // RBAC validation - user must be authenticated
    const authValidation = validateUser(request);
    if (authValidation.error) {
      return NextResponse.json(
        {
          success: false,
          error: authValidation.error,
        },
        { status: authValidation.status }
      );
    }

    // Check if vehicle exists
    const existingVehicle = typeof dbHelpers.findVehicleById === 'function'
      ? await dbHelpers.findVehicleById(id)
      : (global as any).mockVehicles?.find((v: Vehicle) => v.id === id);

    if (!existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vehicle not found',
        },
        { status: 404 }
      );
    }

    // RBAC: Only admins can change company ownership
    if (!authValidation.isAdmin && body.companyId && body.companyId !== existingVehicle.companyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: Only administrators can change vehicle ownership',
        },
        { status: 403 }
      );
    }

    // RBAC: Non-admin users can only update their own company vehicles
    if (!authValidation.isAdmin && authValidation.userCompany &&
        existingVehicle.companyId !== authValidation.userCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: You can only update your own company vehicles',
        },
        { status: 403 }
      );
    }

    // Verify company exists if companyId is being updated
    if (body.companyId) {
      const company = dbHelpers.findCompanyById(body.companyId);
      if (!company) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
          },
          { status: 404 }
        );
      }
    }

    // Update vehicle
    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      ...body,
      id, // Ensure ID doesn't change
      lastUpdated: new Date().toISOString(),
    };

    if (typeof dbHelpers.updateVehicle === 'function') {
      const result = await dbHelpers.updateVehicle(id, updatedVehicle);
      if (!result) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to update vehicle',
          },
          { status: 500 }
        );
      }
    } else {
      // Fallback: update in global variable
      const index = (global as any).mockVehicles?.findIndex((v: Vehicle) => v.id === id);
      if (index !== -1) {
        (global as any).mockVehicles[index] = updatedVehicle;
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully',
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update vehicle',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vehicles/[id] - Delete a vehicle
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // RBAC validation - user must be authenticated
    const authValidation = validateUser(request);
    if (authValidation.error) {
      return NextResponse.json(
        {
          success: false,
          error: authValidation.error,
        },
        { status: authValidation.status }
      );
    }

    // Check if vehicle exists
    const existingVehicle = typeof dbHelpers.findVehicleById === 'function'
      ? await dbHelpers.findVehicleById(id)
      : (global as any).mockVehicles?.find((v: Vehicle) => v.id === id);

    if (!existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vehicle not found',
        },
        { status: 404 }
      );
    }

    // RBAC: Non-admin users can only delete their own company vehicles
    if (!authValidation.isAdmin && authValidation.userCompany &&
        existingVehicle.companyId !== authValidation.userCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: You can only delete your own company vehicles',
        },
        { status: 403 }
      );
    }

    // Delete vehicle
    if (typeof dbHelpers.deleteVehicle === 'function') {
      const result = await dbHelpers.deleteVehicle(id);
      if (!result) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to delete vehicle',
          },
          { status: 500 }
        );
      }
    } else {
      // Fallback: delete from global variable
      const index = (global as any).mockVehicles?.findIndex((v: Vehicle) => v.id === id);
      if (index !== -1) {
        (global as any).mockVehicles.splice(index, 1);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete vehicle',
      },
      { status: 500 }
    );
  }
}