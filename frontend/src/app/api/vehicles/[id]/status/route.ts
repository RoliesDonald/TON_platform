/**
 * Next.js API Route for Vehicle Status Updates
 * Handles PATCH operations for updating vehicle status
 */

import { NextRequest, NextResponse } from 'next/server';
import { Vehicle } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * PATCH /api/vehicles/[id]/status - Update vehicle status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();

    // Validate status
    const validStatuses = ['available', 'rented', 'maintenance', 'reserved', 'unavailable'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: available, rented, maintenance, reserved, unavailable',
        },
        { status: 400 }
      );
    }

    // Update vehicle status
    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      status: body.status,
      lastUpdated: new Date().toISOString(),
    };

    if (typeof dbHelpers.updateVehicle === 'function') {
      const result = await dbHelpers.updateVehicle(id, { status: body.status });
      if (!result) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to update vehicle status',
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
      message: `Vehicle status updated to ${body.status} successfully`,
    });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update vehicle status',
      },
      { status: 500 }
    );
  }
}