import { RobotListing } from '@/types';

export const mockListings: RobotListing[] = [
  {
    id: 'listing-1',
    sellerId: 'user-1',
    title: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum',
    description: `Selling my iRobot Roomba j7+ in excellent condition. This smart vacuum has been amazing for keeping my floors clean with minimal effort.

**Key Features:**
- PrecisionVision Navigation to identify and avoid obstacles
- Self-emptying Clean Base (holds up to 60 days of debris)
- Smart Mapping with room-by-room control
- Works with Alexa and Google Assistant
- Ideal for homes with pets

**Reason for selling:** Upgrading to the Roomba Combo j9+

All original accessories included. Happy to demonstrate before purchase.`,
    category: 'home-cleaning',
    brand: 'iRobot',
    model: 'Roomba j7+',
    year: 2023,
    condition: 'excellent',
    price: 899,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1673096082892-2bc0bc642b22?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '33.9 x 33.9 x 8.7 cm',
      weight: '3.4 kg',
      batteryLife: '75 minutes',
      connectivity: ['WiFi', 'Bluetooth', 'Alexa', 'Google Assistant'],
      features: ['Self-emptying', 'Smart mapping', 'Obstacle avoidance', 'Pet-friendly'],
      includedAccessories: ['Clean Base', 'Extra filter', 'Charging dock', 'Power cord'],
    },
    location: { city: 'Sydney', state: 'NSW', postcode: '2000' },
    status: 'active',
    views: 342,
    favorites: 28,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
    featured: true,
  },
  {
    id: 'listing-2',
    sellerId: 'user-2',
    title: 'Boston Dynamics Spot Robot Dog',
    description: `Rare opportunity to own a Boston Dynamics Spot robot! This is the Enterprise edition with full SDK access.

**What's Included:**
- Spot robot (Enterprise edition)
- 2x Battery packs
- Charging station
- Spot SDK license
- Carrying case

**Condition:** Like new, only used for demonstrations. Under 50 hours of operation.

This is perfect for research institutions, universities, or serious robotics enthusiasts. All documentation and software licenses will be transferred.

**Note:** Buyer must sign transfer agreement with Boston Dynamics.`,
    category: 'industrial',
    brand: 'Boston Dynamics',
    model: 'Spot Enterprise',
    year: 2024,
    condition: 'like-new',
    price: 74500,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '110 x 50 x 84 cm',
      weight: '32.5 kg',
      batteryLife: '90 minutes',
      connectivity: ['WiFi', 'Ethernet', '4G LTE'],
      features: ['Autonomous navigation', 'Payload mounting', 'SDK access', 'Remote operation'],
      includedAccessories: ['2x Batteries', 'Charger', 'Carry case', 'SDK license'],
    },
    location: { city: 'Melbourne', state: 'VIC', postcode: '3000' },
    status: 'active',
    views: 1247,
    favorites: 89,
    createdAt: '2025-01-08T14:30:00Z',
    updatedAt: '2025-01-12T10:00:00Z',
    featured: true,
  },
  {
    id: 'listing-3',
    sellerId: 'user-6',
    title: 'DJI Mavic 3 Pro with Fly More Combo',
    description: `Selling my DJI Mavic 3 Pro with the complete Fly More Combo kit. Perfect for professional aerial photography and videography.

**Specifications:**
- Hasselblad camera with 4/3 CMOS sensor
- 43-min max flight time
- 15km HD video transmission
- Omnidirectional obstacle sensing

**What's Included:**
- DJI Mavic 3 Pro
- 3x Intelligent Flight Batteries
- 6x Low-Noise Propellers (pairs)
- DJI RC Pro controller
- Carrying case
- ND Filter Set

Only 45 flight cycles. Always stored properly. No crashes or repairs.`,
    category: 'drones',
    brand: 'DJI',
    model: 'Mavic 3 Pro',
    year: 2024,
    condition: 'excellent',
    price: 3499,
    negotiable: false,
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '231 x 98 x 95 mm (folded)',
      weight: '958 g',
      batteryLife: '43 minutes',
      connectivity: ['OcuSync 3+', 'WiFi', 'Bluetooth'],
      features: ['4K/120fps video', 'Hasselblad camera', 'Omnidirectional sensing', 'ActiveTrack 5.0'],
      includedAccessories: ['3x Batteries', 'RC Pro', 'ND Filters', 'Carrying case'],
    },
    location: { city: 'Canberra', state: 'ACT', postcode: '2600' },
    status: 'active',
    views: 567,
    favorites: 43,
    createdAt: '2025-01-05T11:00:00Z',
    updatedAt: '2025-01-05T11:00:00Z',
    featured: true,
  },
  {
    id: 'listing-4',
    sellerId: 'user-3',
    title: 'Husqvarna Automower 450X Robotic Lawn Mower',
    description: `Keep your lawn perfectly manicured with the Husqvarna Automower 450X. Suitable for lawns up to 5000m².

**Features:**
- GPS-assisted navigation
- Handles slopes up to 45%
- Weather timer
- Connects to Automower Connect app

Used for 2 seasons. Works flawlessly. Selling due to move to apartment.

Includes all boundary wire (150m) and installation kit.`,
    category: 'lawn-garden',
    brand: 'Husqvarna',
    model: 'Automower 450X',
    year: 2023,
    condition: 'good',
    price: 4200,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '72 x 56 x 31 cm',
      weight: '13.9 kg',
      batteryLife: '270 minutes',
      connectivity: ['GPS', 'Cellular', 'Bluetooth'],
      features: ['GPS navigation', '45% slope handling', 'Weather timer', 'App control'],
      includedAccessories: ['Boundary wire', 'Charging station', 'Installation kit'],
    },
    location: { city: 'Brisbane', state: 'QLD', postcode: '4000' },
    status: 'active',
    views: 234,
    favorites: 19,
    createdAt: '2025-01-12T08:00:00Z',
    updatedAt: '2025-01-12T08:00:00Z',
  },
  {
    id: 'listing-5',
    sellerId: 'user-5',
    title: 'LEGO Mindstorms Robot Inventor (51515)',
    description: `Unleash creativity with the LEGO Mindstorms Robot Inventor! Perfect for kids and adults interested in learning robotics and coding.

**Build 5 Unique Robots:**
- Blast
- Charlie
- Tricky
- Gelo
- M.V.P.

Complete set with all 949 pieces. Includes the intelligent hub with 6-axis gyro and 5x5 LED matrix.

Only opened and built once. All pieces accounted for and in perfect condition.`,
    category: 'educational',
    brand: 'LEGO',
    model: 'Mindstorms Robot Inventor 51515',
    year: 2023,
    condition: 'like-new',
    price: 450,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=600&fit=crop',
    ],
    specifications: {
      weight: '2.1 kg',
      connectivity: ['Bluetooth', 'USB'],
      features: ['949 pieces', 'Intelligent Hub', 'Python & Scratch coding', '5 robot designs'],
      includedAccessories: ['All pieces', 'Intelligent Hub', 'Motors', 'Sensors'],
    },
    location: { city: 'Adelaide', state: 'SA', postcode: '5000' },
    status: 'active',
    views: 189,
    favorites: 31,
    createdAt: '2025-01-14T16:00:00Z',
    updatedAt: '2025-01-14T16:00:00Z',
  },
  {
    id: 'listing-6',
    sellerId: 'user-4',
    title: 'Sony Aibo ERS-1000 Robot Dog',
    description: `Meet Aibo, Sony's lovable robot companion! This AI-powered robotic dog develops its own unique personality over time.

**Features:**
- OLED eyes with expressive emotions
- AI-powered personality development
- Learns tricks and responds to commands
- Cloud connectivity for updates

This Aibo has been loved for about a year. He's developed a playful and curious personality. Comes with all original packaging and accessories.

Perfect for robot enthusiasts or as a unique companion.`,
    category: 'companion',
    brand: 'Sony',
    model: 'Aibo ERS-1000',
    year: 2023,
    condition: 'excellent',
    price: 2800,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '29.3 x 18 x 30.5 cm',
      weight: '2.2 kg',
      batteryLife: '2 hours',
      connectivity: ['WiFi', 'LTE', 'Bluetooth'],
      features: ['AI personality', 'OLED eyes', 'Voice recognition', 'Cloud connected'],
      includedAccessories: ['Charging station', 'Aibone toy', 'Pink ball'],
    },
    location: { city: 'Perth', state: 'WA', postcode: '6000' },
    status: 'active',
    views: 412,
    favorites: 56,
    createdAt: '2025-01-11T13:00:00Z',
    updatedAt: '2025-01-11T13:00:00Z',
    featured: true,
  },
  {
    id: 'listing-7',
    sellerId: 'user-1',
    title: 'Roborock S8 Pro Ultra Robot Vacuum & Mop',
    description: `The ultimate cleaning solution! Roborock S8 Pro Ultra with the RockDock Ultra for complete automation.

**What Makes It Special:**
- Self-washing mop with hot water
- Self-emptying dustbin
- Self-refilling water tank
- DuoRoller Riser brush system
- 6000Pa suction power

Less than 6 months old. Moving overseas so must sell. Works perfectly.`,
    category: 'home-cleaning',
    brand: 'Roborock',
    model: 'S8 Pro Ultra',
    year: 2024,
    condition: 'like-new',
    price: 1699,
    negotiable: false,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '35.3 x 35.3 x 9.65 cm',
      weight: '4.2 kg',
      batteryLife: '180 minutes',
      connectivity: ['WiFi', 'Alexa', 'Google Home', 'Matter'],
      features: ['Self-emptying', 'Self-washing', 'Hot water mop', '6000Pa suction'],
      includedAccessories: ['RockDock Ultra', 'Mop pads', 'Filters', 'Cleaning solution'],
    },
    location: { city: 'Sydney', state: 'NSW', postcode: '2010' },
    status: 'active',
    views: 298,
    favorites: 41,
    createdAt: '2025-01-13T10:00:00Z',
    updatedAt: '2025-01-13T10:00:00Z',
  },
  {
    id: 'listing-8',
    sellerId: 'user-2',
    title: 'UBTECH Alpha 1 Pro Humanoid Robot',
    description: `Programmable humanoid robot perfect for learning robotics and entertaining!

**Features:**
- 16 servo joints for fluid movements
- 3D visual programming
- PRP (Pose, Record, Playback) mode
- Dance, Kung Fu, and yoga moves

Great for STEM education or just having fun. Kids love it!

Works perfectly with all original parts.`,
    category: 'entertainment',
    brand: 'UBTECH',
    model: 'Alpha 1 Pro',
    year: 2022,
    condition: 'good',
    price: 399,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '39.8 x 19.8 x 10.6 cm',
      weight: '1.7 kg',
      batteryLife: '60 minutes',
      connectivity: ['Bluetooth', 'USB'],
      features: ['16 servo joints', 'Visual programming', 'PRP mode', 'Built-in speaker'],
      includedAccessories: ['Charger', 'USB cable', 'Quick start guide'],
    },
    location: { city: 'Melbourne', state: 'VIC', postcode: '3004' },
    status: 'active',
    views: 156,
    favorites: 12,
    createdAt: '2025-01-09T15:30:00Z',
    updatedAt: '2025-01-09T15:30:00Z',
  },
  {
    id: 'listing-9',
    sellerId: 'user-6',
    title: 'DJI Mini 4 Pro Drone - Fly More Combo',
    description: `Perfect beginner drone with professional features!

**Why It's Great:**
- Under 249g (no registration required in most countries)
- 4K/60fps HDR video
- 34-min flight time
- Omnidirectional obstacle sensing
- ActiveTrack 360°

Flown only 10 times. Perfect condition. Great for learning to fly!`,
    category: 'drones',
    brand: 'DJI',
    model: 'Mini 4 Pro',
    year: 2024,
    condition: 'like-new',
    price: 1299,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '148 x 94 x 64 mm (folded)',
      weight: '249 g',
      batteryLife: '34 minutes',
      connectivity: ['OcuSync 3.0', 'WiFi'],
      features: ['4K/60fps', 'HDR video', 'Omnidirectional sensing', 'Under 249g'],
      includedAccessories: ['3x Batteries', 'RC 2 controller', 'Shoulder bag', 'ND filters'],
    },
    location: { city: 'Canberra', state: 'ACT', postcode: '2601' },
    status: 'active',
    views: 423,
    favorites: 67,
    createdAt: '2025-01-07T09:00:00Z',
    updatedAt: '2025-01-07T09:00:00Z',
  },
  {
    id: 'listing-10',
    sellerId: 'user-5',
    title: 'Sphero BOLT - App-Enabled Robot Ball',
    description: `Educational robot ball for learning coding through play!

**Perfect for:**
- Kids ages 8+
- STEM education
- Learning JavaScript, Scratch
- Understanding sensors and programming

Features programmable LED matrix and advanced sensors.

Used in classroom setting, fully functional.`,
    category: 'educational',
    brand: 'Sphero',
    model: 'BOLT',
    year: 2023,
    condition: 'good',
    price: 129,
    negotiable: false,
    images: [
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '7.3 cm diameter',
      weight: '200 g',
      batteryLife: '2 hours',
      connectivity: ['Bluetooth'],
      features: ['LED matrix', 'Infrared sensor', 'Compass', 'Light sensor', 'Gyroscope'],
      includedAccessories: ['Charging cradle', 'USB cable'],
    },
    location: { city: 'Adelaide', state: 'SA', postcode: '5006' },
    status: 'active',
    views: 87,
    favorites: 9,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
  },
  {
    id: 'listing-11',
    sellerId: 'user-4',
    title: 'Ecovacs Deebot X2 Omni Robot Vacuum',
    description: `Square design reaches corners better than round robots!

**Features:**
- OMNI Station (self-empty, self-wash, self-dry, self-refill)
- 8000Pa suction
- AIVI 3D 2.0 obstacle avoidance
- Square design for corners
- YIKO Voice Assistant

Only 4 months old. Selling because I'm moving to a smaller apartment.`,
    category: 'home-cleaning',
    brand: 'Ecovacs',
    model: 'Deebot X2 Omni',
    year: 2024,
    condition: 'like-new',
    price: 1899,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '32 x 32 x 9.5 cm',
      weight: '4.2 kg',
      batteryLife: '175 minutes',
      connectivity: ['WiFi', 'Alexa', 'Google Assistant'],
      features: ['8000Pa suction', 'Square design', 'AIVI 3D', 'Voice assistant'],
      includedAccessories: ['OMNI Station', 'Mop pads', 'Filters', 'Cleaning solution'],
    },
    location: { city: 'Perth', state: 'WA', postcode: '6005' },
    status: 'active',
    views: 312,
    favorites: 28,
    createdAt: '2025-01-06T14:00:00Z',
    updatedAt: '2025-01-06T14:00:00Z',
  },
  {
    id: 'listing-12',
    sellerId: 'user-3',
    title: 'Makeblock mBot2 Coding Robot Kit',
    description: `Great introductory robot for kids learning to code!

**Educational Features:**
- Block-based and Python coding
- CyberPi main controller with color display
- Multiple sensors included
- WiFi and Bluetooth connectivity

Perfect condition, assembled once. Great gift for curious kids!`,
    category: 'educational',
    brand: 'Makeblock',
    model: 'mBot2',
    year: 2024,
    condition: 'like-new',
    price: 159,
    negotiable: false,
    images: [
      'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '18 x 13 x 9 cm',
      weight: '500 g',
      batteryLife: '90 minutes',
      connectivity: ['WiFi', 'Bluetooth'],
      features: ['CyberPi controller', 'Color display', 'Multiple sensors', 'Easy assembly'],
      includedAccessories: ['All parts', 'Screwdriver', 'Quick start guide'],
    },
    location: { city: 'Brisbane', state: 'QLD', postcode: '4006' },
    status: 'active',
    views: 134,
    favorites: 22,
    createdAt: '2025-01-16T08:30:00Z',
    updatedAt: '2025-01-16T08:30:00Z',
  },
  {
    id: 'listing-13',
    sellerId: 'user-1',
    title: 'Ring Always Home Cam - Indoor Drone',
    description: `Autonomous indoor security drone that flies preset paths to check in on your home!

**Features:**
- Autonomous flight
- 1080p HD camera
- Docks and charges automatically
- Ring Alarm integration
- Privacy shutters when docked

Rare item - only available by invitation in the US. Works perfectly in Australia.`,
    category: 'security',
    brand: 'Ring',
    model: 'Always Home Cam',
    year: 2024,
    condition: 'new',
    price: 499,
    negotiable: false,
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: 'Compact (fits in palm)',
      weight: '200 g',
      batteryLife: '5 minutes flight',
      connectivity: ['WiFi'],
      features: ['Autonomous flight', '1080p HD', 'Auto-docking', 'Privacy shutters'],
      includedAccessories: ['Charging dock', 'Power adapter', 'Mounting kit'],
    },
    location: { city: 'Sydney', state: 'NSW', postcode: '2021' },
    status: 'active',
    views: 567,
    favorites: 89,
    createdAt: '2025-01-04T12:00:00Z',
    updatedAt: '2025-01-04T12:00:00Z',
    featured: true,
  },
  {
    id: 'listing-14',
    sellerId: 'user-2',
    title: 'Segway Ninebot KickScooter with Robot Features',
    description: `Self-balancing scooter with semi-autonomous features!

Can follow you, return to charging station, and be summoned remotely.

**Unique Features:**
- UWB precise positioning
- Semi-autonomous driving
- Auto-return to dock
- Remote summoning via app

Only 200km on odometer. Perfect for last-mile commuting.`,
    category: 'hobby-diy',
    brand: 'Segway',
    model: 'Ninebot KickScooter',
    year: 2024,
    condition: 'excellent',
    price: 1599,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '116 x 47 x 120 cm',
      weight: '23 kg',
      batteryLife: '65 km range',
      connectivity: ['Bluetooth', 'UWB'],
      features: ['Self-balancing', 'Auto-return', 'Remote summon', 'Semi-autonomous'],
      includedAccessories: ['Charger', 'Parking dock', 'Phone mount'],
    },
    location: { city: 'Melbourne', state: 'VIC', postcode: '3008' },
    status: 'active',
    views: 245,
    favorites: 34,
    createdAt: '2025-01-03T10:00:00Z',
    updatedAt: '2025-01-03T10:00:00Z',
  },
  {
    id: 'listing-15',
    sellerId: 'user-4',
    title: 'Enabot Ebo SE Mobile Home Robot',
    description: `Interactive pet companion and home monitoring robot!

**Perfect for:**
- Checking on pets when away
- Home security monitoring
- Playing with cats/dogs
- Two-way audio communication

Self-charging, rolls around autonomously, and has treat dispenser attachment.`,
    category: 'companion',
    brand: 'Enabot',
    model: 'Ebo SE',
    year: 2024,
    condition: 'good',
    price: 199,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '10 x 10 x 10 cm',
      weight: '300 g',
      batteryLife: '4 hours',
      connectivity: ['WiFi'],
      features: ['1080p camera', 'Two-way audio', 'Self-charging', 'Autonomous roaming'],
      includedAccessories: ['Charging dock', 'USB cable'],
    },
    location: { city: 'Perth', state: 'WA', postcode: '6009' },
    status: 'active',
    views: 178,
    favorites: 29,
    createdAt: '2025-01-02T16:00:00Z',
    updatedAt: '2025-01-02T16:00:00Z',
  },
  {
    id: 'listing-16',
    sellerId: 'user-6',
    title: 'Skydio 2+ Autonomous Drone',
    description: `The most intelligent drone ever made! Skydio 2+ with incredible autonomous flying capabilities.

**Why Skydio:**
- 360° obstacle avoidance with 6 cameras
- Autonomous subject tracking
- No flying skills required
- Perfect for action sports

Flies itself while you focus on your activity. Amazing for mountain biking, skiing, etc.`,
    category: 'drones',
    brand: 'Skydio',
    model: '2+',
    year: 2023,
    condition: 'excellent',
    price: 1299,
    negotiable: true,
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',
    ],
    specifications: {
      dimensions: '22.3 x 27.3 x 6.4 cm',
      weight: '775 g',
      batteryLife: '27 minutes',
      connectivity: ['WiFi', 'GPS'],
      features: ['6 camera navigation', 'Autonomous tracking', '4K/60fps HDR', 'KeyFrame'],
      includedAccessories: ['2x Batteries', 'Controller', 'Case'],
    },
    location: { city: 'Canberra', state: 'ACT', postcode: '2604' },
    status: 'active',
    views: 345,
    favorites: 52,
    createdAt: '2025-01-01T11:00:00Z',
    updatedAt: '2025-01-01T11:00:00Z',
  },
];
