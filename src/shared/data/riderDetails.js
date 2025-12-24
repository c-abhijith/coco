// src/data/riderDetails.js

export const riderDetails = [
  {
    profile_image:'',
    id: 'R1001',
    name: 'Anand Kumar',
    mobile: '9998887771',
    email: 'anand.kumar@example.com',
    joinDate: '2024-03-10',
    rating: 4.8,

    totalTrips: 3,          // T10001, T10003, T20002
    completedTrips: 2,
    cancelledTrips: 1,
    totalSpend: 750,        // 250 + 180 + 320

    lastTripAt: '2025-01-14T11:25:00', // T20002
    lastPickup: 'Panampilly Nagar, Kochi',
    lastDrop: 'Aluva Metro Station, Kochi',

    riderAppVersion: '2.5.1',
    riderMobileType: 'Android',
    notes: 'Occasional cancellations, mostly office rides to Infopark.',
  },
  {
    id: 'R1002',
    name: 'Bhavana Nair',
    mobile: '9998887772',
    email: 'bhavana.nair@example.com',
    joinDate: '2023-11-05',
    rating: 4.6,

    totalTrips: 2,          // T10002, T30001
    completedTrips: 2,
    cancelledTrips: 0,
    totalSpend: 630,        // 220 + 410

    lastTripAt: '2025-01-11T18:40:00', // T10002
    lastPickup: 'Vytilla Mobility Hub, Kochi',
    lastDrop: 'Lulu Mall, Edappally',

    riderAppVersion: '2.5.1',
    riderMobileType: 'iOS',
    notes: 'Frequently books morning and evening office trips.',
  },
  {
    id: 'R1003',
    name: 'Salim Rahman',
    mobile: '9998887773',
    email: 'salim.rahman@example.com',
    joinDate: '2024-01-20',
    rating: 4.2,

    totalTrips: 2,          // T20001, T30002
    completedTrips: 2,
    cancelledTrips: 0,
    totalSpend: 580,        // 300 + 280

    lastTripAt: '2025-01-15T19:05:00', // T30002
    lastPickup: 'Palarivattom, Kochi',
    lastDrop: 'Marine Drive, Kochi',

    riderAppVersion: '2.4.9',
    riderMobileType: 'Android',
    notes: 'Prefers cash payment and evening trips towards city side.',
  },
  {
    id: 'R1004',
    name: 'Divya Menon',
    mobile: '9998887774',
    email: 'divya.menon@example.com',
    joinDate: '2024-06-01',
    rating: 4.9,

    totalTrips: 1,          // T20003
    completedTrips: 1,
    cancelledTrips: 0,
    totalSpend: 190,

    lastTripAt: '2025-01-15T16:50:00',
    lastPickup: 'Kakkanad Civil Station, Kochi',
    lastDrop: 'Panampilly Nagar, Kochi',

    riderAppVersion: '2.5.0',
    riderMobileType: 'iOS',
    notes: 'High value corporate rider, mostly intra-city meetings.',
  },
]
