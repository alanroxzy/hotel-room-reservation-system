"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Room } from "@/types/hotel"

interface HotelFloorPlanProps {
  rooms: Record<number, Room>
}

export function HotelFloorPlan({ rooms }: HotelFloorPlanProps) {
  const floors = Array.from({ length: 10 }, (_, i) => i + 1)

  const getRoomsForFloor = (floor: number) => {
    const roomNumbers = Object.keys(rooms)
      .map(Number)
      .filter((roomNum) => {
        if (floor === 10) return roomNum >= 1001 && roomNum <= 1007
        return Math.floor(roomNum / 100) === floor
      })
      .sort((a, b) => a - b)

    return roomNumbers.map((num) => rooms[num])
  }

  const getRoomStatusColor = (room: Room) => {
    if (room.isBooked) return "bg-destructive text-destructive-foreground"
    return "bg-primary text-primary-foreground hover:bg-primary/90"
  }

  const getRoomStatusText = (room: Room) => {
    return room.isBooked ? "Booked" : "Available"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Hotel Floor Plan
          <Badge variant="outline">97 Rooms Total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {floors.reverse().map((floor) => {
          const floorRooms = getRoomsForFloor(floor)
          const bookedCount = floorRooms.filter((room) => room.isBooked).length

          return (
            <div key={floor} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Floor {floor}
                  {floor === 10 && <span className="text-sm text-muted-foreground ml-2">(Top Floor)</span>}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline">{floorRooms.length - bookedCount} Available</Badge>
                  <Badge variant="destructive">{bookedCount} Booked</Badge>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-2">
                {/* Staircase/Lift indicator */}
                <div className="flex items-center justify-center bg-muted rounded-md p-2 text-xs text-muted-foreground">
                  🏢
                </div>

                {/* Rooms */}
                {floorRooms.map((room) => (
                  <div
                    key={room.number}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-md text-xs font-medium transition-colors cursor-pointer",
                      getRoomStatusColor(room),
                    )}
                    title={`Room ${room.number} - ${getRoomStatusText(room)}`}
                  >
                    <div className="font-bold">{room.number}</div>
                    <div className="text-[10px] opacity-80">{room.isBooked ? "Booked" : "Free"}</div>
                  </div>
                ))}

                {/* Fill empty slots for floors with less than 10 rooms */}
                {Array.from({ length: 10 - floorRooms.length }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
              </div>
            </div>
          )
        })}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center text-xs">🏢</div>
            <span className="text-sm">Stairs/Lift</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
