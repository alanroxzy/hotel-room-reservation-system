"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Clock } from "lucide-react"
import { HotelFloorPlan } from "@/components/hotel-floor-plan"
import { BookingPanel } from "@/components/booking-panel"
import { TravelTimeCalculator } from "@/components/travel-time-calculator"
import { useHotelReservation } from "@/hooks/use-hotel-reservation"

export default function HotelReservationSystem() {
  const {
    rooms,
    bookedRooms,
    bookRooms,
    resetBookings,
    generateRandomOccupancy,
    calculateTravelTime,
    getOptimalRooms,
  } = useHotelReservation()

  const [roomsToBook, setRoomsToBook] = useState(1)
  const [lastBookingResult, setLastBookingResult] = useState<{
    rooms: number[]
    travelTime: number
  } | null>(null)

  const handleBooking = () => {
    if (roomsToBook < 1 || roomsToBook > 5) {
      alert("Please enter a number between 1 and 5 rooms")
      return
    }

    const optimalRooms = getOptimalRooms(roomsToBook)
    if (optimalRooms.length === 0) {
      alert("No available rooms found")
      return
    }

    const success = bookRooms(optimalRooms)
    if (success) {
      const travelTime = calculateTravelTime(optimalRooms)
      setLastBookingResult({ rooms: optimalRooms, travelTime })
    }
  }

  const availableRooms = Object.values(rooms).filter((room) => !room.isBooked).length
  const totalRooms = Object.keys(rooms).length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Hotel Room Reservation System
          </h1>
          <p className="text-muted-foreground">Optimize room bookings with travel time minimization</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{availableRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booked</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{bookedRooms.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((bookedRooms.length / totalRooms) * 100)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Booking Panel */}
          <div className="lg:col-span-1 space-y-4">
            <BookingPanel
              roomsToBook={roomsToBook}
              setRoomsToBook={setRoomsToBook}
              onBook={handleBooking}
              onReset={resetBookings}
              onRandomOccupancy={generateRandomOccupancy}
              lastBookingResult={lastBookingResult}
            />

            {lastBookingResult && (
              <TravelTimeCalculator bookedRooms={lastBookingResult.rooms} travelTime={lastBookingResult.travelTime} />
            )}
          </div>

          {/* Hotel Floor Plan */}
          <div className="lg:col-span-3">
            <HotelFloorPlan rooms={rooms} />
          </div>
        </div>
      </div>
    </div>
  )
}
