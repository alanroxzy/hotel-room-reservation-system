"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

interface TravelTimeCalculatorProps {
  bookedRooms: number[]
  travelTime: number
}

export function TravelTimeCalculator({ bookedRooms, travelTime }: TravelTimeCalculatorProps) {
  const getFloor = (roomNumber: number) => {
    if (roomNumber >= 1001) return 10
    return Math.floor(roomNumber / 100)
  }

  const getRoomPosition = (roomNumber: number) => {
    if (roomNumber >= 1001) return roomNumber - 1000
    return roomNumber % 100
  }

  const sortedRooms = [...bookedRooms].sort((a, b) => a - b)
  const floors = [...new Set(sortedRooms.map(getFloor))].sort((a, b) => a - b)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Travel Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{travelTime}</div>
          <div className="text-sm text-muted-foreground">minutes total travel time</div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Room Distribution:</div>
          {floors.map((floor) => {
            const roomsOnFloor = sortedRooms.filter((room) => getFloor(room) === floor)
            return (
              <div key={floor} className="flex items-center justify-between">
                <span className="text-sm">Floor {floor}:</span>
                <div className="flex gap-1">
                  {roomsOnFloor.map((room) => (
                    <Badge key={room} variant="outline" className="text-xs">
                      {room}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {floors.length > 1 && (
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 inline mr-1" />
              Multi-floor booking optimized for minimal travel time
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
