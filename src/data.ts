import { Aircraft, FlightRoute, ConciergeRequest, PassengerProfile } from './types';

export const fleet: Aircraft[] = [
  {
    id: 'a1',
    name: 'Gulfstream G650',
    class: 'Ultra Long Range',
    rangeKm: 12964,
    seats: 14,
    speedMach: 0.925,
    hourlyRate: 11500,
    image: 'https://images.unsplash.com/photo-1579487964645-5602d32dd326?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: ['Sleep Configuration', 'Ka-band Wi-Fi', 'Full Galley', 'Shower']
  },
  {
    id: 'a2',
    name: 'Bombardier Global 7500',
    class: 'Ultra Long Range',
    rangeKm: 14260,
    seats: 19,
    speedMach: 0.925,
    hourlyRate: 12200,
    image: 'https://images.unsplash.com/photo-1590494541539-775b8ce1121d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: ['4 Distinct Living Spaces', 'Permanent Bed', 'Master Suite', 'Nuage Seats']
  },
  {
    id: 'a3',
    name: 'Dassault Falcon 8X',
    class: 'Ultra Long Range',
    rangeKm: 11945,
    seats: 12,
    speedMach: 0.90,
    hourlyRate: 9800,
    image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: ['Whisper Quiet Cabin', 'Air Quality System', 'Short Field Performance']
  },
  {
    id: 'a4',
    name: 'Embraer Praetor 600',
    class: 'Super Midsize',
    rangeKm: 7441,
    seats: 9,
    speedMach: 0.83,
    hourlyRate: 7500,
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    features: ['Class-leading Payload', 'HEPA Filter', 'Bossa Nova Interior']
  }
];

export const activeFlights: FlightRoute[] = [
  {
    id: 'f1',
    from: 'JFK',
    to: 'LHR',
    duration: '6h 30m',
    departureTime: '22:00 EST',
    arrivalTime: '10:30 BST',
    aircraftId: 'a1',
    status: 'In-Flight',
    progress: 65
  },
  {
    id: 'f2',
    from: 'DXB',
    to: 'VKO',
    duration: '5h 15m',
    departureTime: '14:00 GST',
    arrivalTime: '18:15 MSK',
    aircraftId: 'a2',
    status: 'Scheduled',
    progress: 0
  },
  {
    id: 'f3',
    from: 'LAX',
    to: 'HND',
    duration: '11h 20m',
    departureTime: '09:00 PST',
    arrivalTime: '14:20 JST',
    aircraftId: 'a3',
    status: 'Landed',
    progress: 100
  }
];

export const conciergeRequests: ConciergeRequest[] = [
  {
    id: 'c1',
    type: 'Transport',
    title: 'Helicopter Transfer to Manhattan',
    status: 'Confirmed',
    date: 'Oct 24, 2026',
    details: 'Blade pickup at Teterboro Airport to W 30th St Heliport.'
  },
  {
    id: 'c2',
    type: 'Dining',
    title: 'Le Bernardin Reservation',
    status: 'Pending',
    date: 'Oct 25, 2026',
    details: 'Dinner for 4, Private Room requested.'
  },
  {
    id: 'c3',
    type: 'Hotel',
    title: 'The Ritz-Carlton New York, Central Park',
    status: 'Confirmed',
    date: 'Oct 24 - Oct 28, 2026',
    details: 'Royal Suite preferred. Early check-in.'
  }
];

export const currentUser: PassengerProfile = {
  name: 'Eleanor Sterling',
  memberSince: '2019',
  loyaltyTier: 'AETHER Vanguard',
  totalFlightHours: 1420,
  preferences: {
    food: ['Pescatarian', 'No Dairy', 'Krug Vintage'],
    seat: 'Aisle - Forward Cabin',
    favoriteAircraft: 'Bombardier Global 7500'
  },
  recentDestinations: ['London', 'Dubai', 'Geneva', 'Tokyo']
};

export const analyticsData = [
  { month: 'Jan', flights: 4, spend: 120000 },
  { month: 'Feb', flights: 3, spend: 95000 },
  { month: 'Mar', flights: 6, spend: 180000 },
  { month: 'Apr', flights: 2, spend: 60000 },
  { month: 'May', flights: 5, spend: 155000 },
  { month: 'Jun', flights: 4, spend: 130000 }
];
