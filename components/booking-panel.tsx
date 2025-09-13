"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, RotateCcw, Shuffle, Clock } from "lucide-react"

interface BookingPanelProps {
  roomsToBook: number
  setRoomsToBook: (value: number) => void
  onBook: () => void
  onReset: () => void
  onRandomOccupancy: () => void
  lastBookingResult: {
    rooms: number[]
    travelTime: number
  } | null
}

export function BookingPanel({
  roomsToBook,
  setRoomsToBook,
  onBook,
  onReset,
  onRandomOccupancy,
  lastBookingResult,
}: BookingPanelProps) {
  return (
    <div className="space-y-4">
      {/* Booking Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Book Rooms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rooms">Number of Rooms (1-5)</Label>
            <Input
              id="rooms"
              type="number"
              min="1"
              max="5"
              value={roomsToBook}
              onChange={(e) => setRoomsToBook(Number.parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>

          <Button onClick={onBook} className="w-full" size="lg">
            Book Optimal Rooms
          </Button>

          {lastBookingResult && (
            <div className="p-3 bg-muted rounded-md space-y-2">
              <div className="text-sm font-medium">Last Booking:</div>
              <div className="flex flex-wrap gap-1">
                {lastBookingResult.rooms.map((room) => (
                  <Badge key={room} variant="secondary">
                    {room}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lastBookingResult.travelTime} min travel time
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onRandomOccupancy} variant="outline" className="w-full bg-transparent">
            <Shuffle className="h-4 w-4 mr-2" />
            Random Occupancy
          </Button>

          <Button onClick={onReset} variant="destructive" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
