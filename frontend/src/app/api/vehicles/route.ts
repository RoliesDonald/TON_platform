/**
 * Next.js API Route for Vehicle Management
 * Handles GET and POST operations for vehicles
 */

import { NextRequest, NextResponse } from 'next/server';
import { Vehicle, VehicleFormData } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * GET /api/vehicles - Get all vehicles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const search = searchParams.get('search');

    let vehicles: Vehicle[] = [];

    // If we have vehicle search functionality
    if (companyId && typeof dbHelpers.findVehiclesByCompany === 'function') {
      vehicles = await dbHelpers.findVehiclesByCompany(companyId);
    } else if (search && typeof dbHelpers.searchVehicles === 'function') {
      vehicles = await dbHelpers.searchVehicles(search);
    } else if (typeof dbHelpers.findVehicleById === 'function') {
      // Return all vehicles (using database for now)
      vehicles = await dbHelpers.searchVehicles('');
    } else {
      // Fallback to empty array
      vehicles = [];
    }

    return NextResponse.json({
      success: true,
      data: vehicles,
      message: `${vehicles.length} vehicles retrieved successfully`,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vehicles',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vehicles - Create a new vehicle
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['vehicleId', 'companyId', 'vehicleInfo'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Get auth token from request headers (for RBAC validation)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // Mock user validation - in a real app, validate the JWT token
    // For demo purposes, we'll accept any token and extract user info
    const token = authHeader.replace('Bearer ', '');
    let userCompany = null;

    // In a real implementation, you would decode the JWT token to get user info
    // For demo, we'll simulate user validation based on the token
    if (token.includes('rental') || token.includes('company')) {
      // Mock user with company access
      userCompany = 'mock-1'; // This would come from the decoded JWT
    }

    // RBAC validation: User can only create vehicles for their own company
    if (userCompany && body.companyId !== userCompany) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: You can only register vehicles for your own company',
        },
        { status: 403 }
      );
    }

    // Verify company exists (skip for admin-access)
    let company = null;
    if (body.companyId === 'admin-access') {
      // For admin users, create a mock company for validation
      company = {
        id: 'admin-access',
        partnership: {
          status: 'active'
        }
      };
    } else {
      company = await dbHelpers.findCompanyById(body.companyId);
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

    // Additional RBAC: Only active companies can register vehicles
    if (company.partnership.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only active rental companies can register vehicles',
        },
        { status: 403 }
      );
    }

    // Create new vehicle
    const newVehicle: Vehicle = {
      ...body,
      id: `vehicle-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      rentalCount: body.rentalCount || 0,
    };

    // Add vehicle to database
    if (typeof dbHelpers.addVehicle === 'function') {
      await dbHelpers.addVehicle(newVehicle);
    } else {
      // Fallback: store in global variable for development
      if (!(global as any).mockVehicles) {
        (global as any).mockVehicles = [];
      }
      (global as any).mockVehicles.push(newVehicle);
    }

    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create vehicle',
      },
      { status: 500 }
    );
  }
}