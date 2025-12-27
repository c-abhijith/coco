// Riders - Normalized core data only (aggregate metrics calculated from trips)

export const riderDetails = [
  {
    id: "R1001",
    image: "https://cdn.cococabs.in/riders/R1001.jpg",
    name: "Anand Kumar",
    mobile: "9998887771",
    email: "anand.kumar@example.com",

    // Independent features (not calculable from trips)
    network_count: 12,
    total_points_till_today: 860,
    outstanding_due: 0,
    pending_amount: 0,

    // Account metadata
    since: "2024-03-10",
    last_logged_at: "2025-01-15T08:30:00",
    pending_scheduled_trips: 1,
    current_status: "Active",
    tag: "Corporate",
    login_otp: "4321"
  },

  {
    id: "R1002",
    image: "https://cdn.cococabs.in/riders/R1002.jpg",
    name: "Bhavana Nair",
    mobile: "9998887772",
    email: "bhavana.nair@example.com",

    network_count: 8,
    total_points_till_today: 920,
    outstanding_due: 0,
    pending_amount: 0,

    since: "2023-11-05",
    last_logged_at: "2025-01-14T18:15:00",
    pending_scheduled_trips: 0,
    current_status: "Active",
    tag: "Regular",
    login_otp: "1188"
  },

  {
    id: "R1003",
    image: "https://cdn.cococabs.in/riders/R1003.jpg",
    name: "Salim Rahman",
    mobile: "9998887773",
    email: "salim.rahman@example.com",

    network_count: 5,
    total_points_till_today: 610,
    outstanding_due: 40,
    pending_amount: 40,

    since: "2024-01-20",
    last_logged_at: "2025-01-12T21:00:00",
    pending_scheduled_trips: 0,
    current_status: "Active",
    tag: "Cash User",
    login_otp: "9090"
  },

  {
    id: "R1004",
    image: "https://cdn.cococabs.in/riders/R1004.jpg",
    name: "Divya Menon",
    mobile: "9998887774",
    email: "divya.menon@example.com",

    network_count: 18,
    total_points_till_today: 1240,
    outstanding_due: 0,
    pending_amount: 0,

    since: "2024-06-01",
    last_logged_at: "2025-01-13T09:10:00",
    pending_scheduled_trips: 2,
    current_status: "Active",
    tag: "Corporate",
    login_otp: "3344"
  },

  {
    id: "R1005",
    image: "https://cdn.cococabs.in/riders/R1005.jpg",
    name: "Arjun Pillai",
    mobile: "9998887775",
    email: "arjun.pillai@example.com",

    network_count: 3,
    total_points_till_today: 310,
    outstanding_due: 90,
    pending_amount: 90,

    since: "2024-09-18",
    last_logged_at: "2025-01-14T19:10:00",
    pending_scheduled_trips: 0,
    current_status: "Blocked",
    tag: "High Risk",
    login_otp: "5566"
  },

  {
    id: "R1006",
    image: "https://cdn.cococabs.in/riders/R1006.jpg",
    name: "Priya Sharma",
    mobile: "9998887776",
    email: "priya.sharma@example.com",

    network_count: 15,
    total_points_till_today: 1100,
    outstanding_due: 0,
    pending_amount: 0,

    since: "2024-02-15",
    last_logged_at: "2025-01-15T06:30:00",
    pending_scheduled_trips: 0,
    current_status: "Active",
    tag: "Regular",
    login_otp: "8899"
  }
]
