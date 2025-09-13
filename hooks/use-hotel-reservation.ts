"use client"

import { useState, useCallback } from "react"
import type { Room } from "@/types/hotel"

export function useHotelReservation() {
  // Initialize all 97 rooms
  const initializeRooms = (): Record<number, Room> => {
    const rooms: Record<number, Room> = {}

    // Floors 1-9: 10 rooms each
    for (let floor = 1; floor <= 9; floor++) {
      for (let room = 1; room <= 10; room++) {
        const roomNumber = floor * 100 + room
        rooms[roomNumber] = {
          number: roomNumber,
          floor,
          position: room,
          isBooked: false,
        }
      }
    }

    // Floor 10: 7 rooms (1001-1007)
    for (let room = 1; room <= 7; room++) {
      const roomNumber = 1000 + room
      rooms[roomNumber] = {
        number: roomNumber,
        floor: 10,
        position: room,
        isBooked: false,
      }
    }

    return rooms
  }

  const [rooms, setRooms] = useState<Record<number, Room>>(initializeRooms)

  const bookedRooms = Object.values(rooms)
    .filter((room) => room.isBooked)
    .map((room) => room.number)

  // Calculate travel time between rooms
  const calculateTravelTime = useCallback(
    (roomNumbers: number[]): number => {
      if (roomNumbers.length <= 1) return 0

      const sortedRooms = [...roomNumbers].sort((a, b) => a - b)
      let totalTime = 0

      for (let i = 0; i < sortedRooms.length - 1; i++) {
        const room1 = rooms[sortedRooms[i]]
        const room2 = rooms[sortedRooms[i + 1]]

        if (room1.floor === room2.floor) {
          // Same floor: 1 minute per room horizontally
          totalTime += Math.abs(room2.position - room1.position)
        } else {
          // Different floors: 2 minutes per floor + horizontal movement
          const verticalTime = Math.abs(room2.floor - room1.floor) * 2
          const horizontalTime = Math.abs(room2.position - room1.position)
          totalTime += verticalTime + horizontalTime
        }
      }

      return totalTime
    },
    [rooms],
  )

  // Get optimal rooms for booking
  const getOptimalRooms = useCallback(
    (count: number): number[] => {
      const availableRooms = Object.values(rooms).filter((room) => !room.isBooked)

      if (availableRooms.length < count) return []

      // Try to book on same floor first
      for (let floor = 1; floor <= 10; floor++) {
        const floorRooms = availableRooms.filter((room) => room.floor === floor).sort((a, b) => a.position - b.position)

        if (floorRooms.length >= count) {
          return floorRooms.slice(0, count).map((room) => room.number)
        }
      }

      // If not possible on same floor, find optimal combination
      let bestCombination: number[] = []
      let bestTravelTime = Number.POSITIVE_INFINITY

      // Generate combinations and find the one with minimum travel time
      const generateCombinations = (available: Room[], needed: number, current: Room[] = []): void => {
        if (current.length === needed) {
          const roomNumbers = current.map((room) => room.number)
          const travelTime = calculateTravelTime(roomNumbers)

          if (travelTime < bestTravelTime) {
            bestTravelTime = travelTime
            bestCombination = [...roomNumbers]
          }
          return
        }

        for (let i = 0; i < available.length; i++) {
          if (current.length + (available.length - i) < needed) break

          generateCombinations(available.slice(i + 1), needed, [...current, available[i]])
        }
      }

      // For performance, limit search for larger counts
      if (count <= 3) {
        generateCombinations(availableRooms, count)
      } else {
        // For 4-5 rooms, use a greedy approach
        const sortedByFloor = availableRooms.sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor
          return a.position - b.position
        })

        bestCombination = sortedByFloor.slice(0, count).map((room) => room.number)
      }

      return bestCombination
    },
    [rooms, calculateTravelTime],
  )

  // Book rooms
  const bookRooms = useCallback(
    (roomNumbers: number[]): boolean => {
      const canBook = roomNumbers.every((num) => rooms[num] && !rooms[num].isBooked)

      if (!canBook) return false

      setRooms((prev) => {
        const updated = { ...prev }
        roomNumbers.forEach((num) => {
          updated[num] = { ...updated[num], isBooked: true }
        })
        return updated
      })

      return true
    },
    [rooms],
  )

  // Reset all bookings
  const resetBookings = useCallback(() => {
    setRooms((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[Number.parseInt(key)].isBooked = false
      })
      return updated
    })
  }, [])

  // Generate random occupancy
  const generateRandomOccupancy = useCallback(() => {
    setRooms((prev) => {
      const updated = { ...prev }
      const roomNumbers = Object.keys(updated).map(Number)

      // Reset all rooms first
      roomNumbers.forEach((num) => {
        updated[num].isBooked = false
      })

      // Randomly book 30-60% of rooms
      const occupancyRate = 0.3 + Math.random() * 0.3
      const roomsToBook = Math.floor(roomNumbers.length * occupancyRate)

      const shuffled = [...roomNumbers].sort(() => Math.random() - 0.5)
      shuffled.slice(0, roomsToBook).forEach((num) => {
        updated[num].isBooked = true
      })

      return updated
    })
  }, [])

  return {
    rooms,
    bookedRooms,
    bookRooms,
    resetBookings,
    generateRandomOccupancy,
    calculateTravelTime,
    getOptimalRooms,
  }
}
