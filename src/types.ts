export interface Aircraft {
  id: string;
  name: string;
  class: string;
  rangeKm: number;
  seats: number;
  speedMach: number;
  hourlyRate: number;
  image: string;
  features: string[];
}

export interface FlightRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  aircraftId: string;
  status: 'Scheduled' | 'Boarding' | 'In-Flight' | 'Landed';
  progress: number;
}

export interface ConciergeRequest {
  id: string;
  type: 'Dining' | 'Transport' | 'Hotel' | 'Security' | 'Special';
  title: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  date: string;
  details: string;
}

export interface PassengerProfile {
  name: string;
  memberSince: string;
  loyaltyTier: string;
  totalFlightHours: number;
  preferences: {
    food: string[];
    seat: string;
    favoriteAircraft: string;
  };
  recentDestinations: string[];
}
