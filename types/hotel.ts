export interface Room {
  number: number
  floor: number
  position: number // Position on floor (1-10 for floors 1-9, 1-7 for floor 10)
  isBooked: boolean
}

export interface BookingResult {
  rooms: number[]
  travelTime: number
  success: boolean
}
