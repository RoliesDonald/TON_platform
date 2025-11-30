/**
 * Next.js API Route for Vehicle Search
 * Handles GET operations for searching vehicles
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * GET /api/vehicles/search - Search vehicles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    let vehicles = [];

    if (typeof dbHelpers.searchVehicles === 'function') {
      vehicles = await dbHelpers.searchVehicles(query);
    } else {
      // Fallback: basic search in mock data
      const mockVehicles = (global as any).mockVehicles || [];
      const lowercaseQuery = query.toLowerCase();
      vehicles = mockVehicles.filter((vehicle: any) =>
        vehicle.vehicleId.toLowerCase().includes(lowercaseQuery) ||
        vehicle.companyName.toLowerCase().includes(lowercaseQuery) ||
        vehicle.vehicleInfo.make.toLowerCase().includes(lowercaseQuery) ||
        vehicle.vehicleInfo.model.toLowerCase().includes(lowercaseQuery) ||
        vehicle.vehicleInfo.plateNumber.toLowerCase().includes(lowercaseQuery) ||
        vehicle.rental.location.toLowerCase().includes(lowercaseQuery)
      );
    }

    return NextResponse.json({
      success: true,
      data: vehicles,
      message: `${vehicles.length} vehicles found matching "${query}"`,
    });
  } catch (error) {
    console.error('Error searching vehicles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search vehicles',
      },
      { status: 500 }
    );
  }
}