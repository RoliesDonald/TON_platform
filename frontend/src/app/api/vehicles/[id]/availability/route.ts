/**
 * Next.js API Route for Vehicle Availability Updates
 * Handles PATCH operations for updating vehicle availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { Vehicle } from '@/lib/api';
import { dbHelpers } from '@/lib/mockDatabase';

/**
 * PATCH /api/vehicles/[id]/availability - Update vehicle availability
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

    // Validate availability
    if (typeof body.available !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Availability must be a boolean value',
        },
        { status: 400 }
      );
    }

    // Update vehicle availability
    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      rental: {
        ...existingVehicle.rental,
        available: body.available,
        availableFrom: body.availableFrom || existingVehicle.rental.availableFrom,
      },
      lastUpdated: new Date().toISOString(),
    };

    if (typeof dbHelpers.updateVehicle === 'function') {
      const result = dbHelpers.updateVehicle(id, {
        rental: {
          ...existingVehicle.rental,
          available: body.available,
          availableFrom: body.availableFrom || existingVehicle.rental.availableFrom,
        }
      });
      if (!result) {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to update vehicle availability',
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
      message: `Vehicle availability updated to ${body.available ? 'available' : 'unavailable'} successfully`,
    });
  } catch (error) {
    console.error('Error updating vehicle availability:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update vehicle availability',
      },
      { status: 500 }
    );
  }
}