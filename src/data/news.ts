import { NewsArticle } from '@/types/news';

// Generate dynamic dates relative to today
const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'iRobot Unveils Next-Generation Roomba with Advanced AI Navigation',
    description: 'The new Roomba j9+ features breakthrough obstacle recognition technology that can identify and avoid over 80 different object types, including pet waste and charging cables.',
    content: `iRobot has announced its latest flagship robot vacuum, the Roomba j9+, featuring what the company calls "the most advanced AI navigation system ever built into a home robot."

The new model uses a combination of front-facing cameras, infrared sensors, and machine learning to create detailed 3D maps of homes while identifying and avoiding obstacles with unprecedented accuracy.

"We've trained our AI on millions of images to recognize everything from shoes to pet toys to charging cables," said iRobot CEO Colin Angle. "The j9+ can navigate around your home like a human would."

Key features include:
- 30% stronger suction than previous models
- Self-emptying base with antimicrobial bag
- Matter smart home compatibility
- Improved battery life up to 120 minutes

The Roomba j9+ will be available starting next month at $1,099.`,
    source: { name: 'TechCrunch', url: 'https://techcrunch.com' },
    author: 'Sarah Chen',
    url: 'https://techcrunch.com/robotics/irobot-roomba-j9-announcement',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(0),
    category: 'product',
    tags: ['iRobot', 'Roomba', 'Robot Vacuum', 'AI', 'Smart Home'],
  },
  {
    id: 'news-2',
    title: 'Boston Dynamics Opens Spot Robot to Consumer Market for First Time',
    description: 'The robotics company known for its viral dancing robots is launching a consumer version of its famous Spot robot dog, priced at $24,500.',
    content: `In a surprising move, Boston Dynamics has announced plans to release a consumer-focused version of its Spot robot, making the famous quadruped available to the general public for the first time.

The "Spot Explorer" edition will feature simplified controls, enhanced safety features, and integration with popular smart home platforms. Unlike the enterprise version used in industrial applications, the consumer model is designed for home entertainment, security monitoring, and companionship.

"We've heard from thousands of people who want to own a Spot," said Boston Dynamics CEO Robert Playter. "The technology has matured to the point where we can safely bring this to homes."

The consumer Spot will include:
- Simplified app-based control
- Pre-programmed behaviors and tricks
- Home security patrol mode
- Integration with Alexa and Google Home
- 90-minute battery life

Pre-orders begin next quarter with deliveries expected by year-end.`,
    source: { name: 'The Verge', url: 'https://theverge.com' },
    author: 'James Mitchell',
    url: 'https://theverge.com/tech/boston-dynamics-spot-consumer',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(0),
    category: 'product',
    tags: ['Boston Dynamics', 'Spot', 'Robot Dog', 'Consumer Robotics'],
  },
  {
    id: 'news-3',
    title: 'DJI Announces Autonomous Delivery Drone for Residential Use',
    description: 'The worlds largest drone manufacturer reveals plans for a home delivery drone system that could revolutionize last-mile logistics.',
    content: `DJI has unveiled its ambitious plans for autonomous drone delivery with the DJI Flyport system, designed to bring packages directly to residential homes.

The system consists of a base station that homeowners install on their property and compact delivery drones that can carry packages up to 5kg. The drones use advanced obstacle avoidance and precision landing technology to safely deliver items to designated drop zones.

"This is the future of package delivery," said DJI spokesperson Lin Chen. "No more missed deliveries or packages left on doorsteps."

The Flyport system features:
- Weather-resistant base station with charging dock
- Real-time tracking via smartphone app
- Secure package compartment with fingerprint access
- 15km delivery range
- Noise levels under 60dB

DJI is partnering with major retailers and logistics companies for pilot programs starting in select cities.`,
    source: { name: 'Engadget', url: 'https://engadget.com' },
    author: 'Maria Rodriguez',
    url: 'https://engadget.com/drones/dji-flyport-delivery-system',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(1),
    category: 'technology',
    tags: ['DJI', 'Drones', 'Delivery', 'Autonomous'],
  },
  {
    id: 'news-4',
    title: 'Study: Robot Vacuum Market to Reach $15 Billion by 2028',
    description: 'New market research predicts explosive growth in the robotic cleaning sector, driven by AI improvements and falling prices.',
    content: `A comprehensive market study by Global Robotics Research predicts the robot vacuum market will grow from $8.5 billion in 2024 to over $15 billion by 2028, representing a compound annual growth rate of 15.3%.

Key factors driving growth include:
- Improvements in AI navigation and obstacle avoidance
- Integration with smart home ecosystems
- Rising demand for hands-free cleaning solutions
- Expansion in emerging markets

The study also notes significant consolidation in the industry, with major players like iRobot, Roborock, and Ecovacs controlling over 70% of the global market.

"The pandemic fundamentally changed how people think about home cleaning," said lead analyst Dr. Patricia Wong. "Robot vacuums went from luxury items to household essentials."

The fastest-growing segment is robot mops, expected to grow at 22% annually as hybrid vacuum-mop robots gain popularity.`,
    source: { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org' },
    author: 'Dr. Patricia Wong',
    url: 'https://spectrum.ieee.org/robotics/consumer/vacuum-market-growth',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(1),
    category: 'business',
    tags: ['Market Research', 'Robot Vacuum', 'Industry Trends'],
  },
  {
    id: 'news-5',
    title: 'Review: Roborock S9 MaxV Ultra - The Ultimate Cleaning Robot',
    description: 'We spent three months testing Roborocks latest flagship. Heres why it might be worth the $1,800 price tag.',
    content: `After extensive testing in multiple homes over three months, we can confidently say the Roborock S9 MaxV Ultra is the most capable robot vacuum weve ever tested.

Pros:
- Exceptional cleaning performance on all surfaces
- Self-washing mop with hot water
- Accurate obstacle avoidance
- Excellent app with detailed mapping
- Quiet operation

Cons:
- Very expensive at $1,799
- Large dock requires significant floor space
- Some carpet detection issues

The S9 MaxV Ultra represents the current pinnacle of robot vacuum technology. Its combination of powerful suction (7,000Pa), intelligent navigation, and comprehensive self-maintenance makes it a genuinely hands-free cleaning solution.

Verdict: 9/10 - The best robot vacuum money can buy, if you can afford it.`,
    source: { name: 'Wired', url: 'https://wired.com' },
    author: 'Tom Anderson',
    url: 'https://wired.com/review/roborock-s9-maxv-ultra',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(2),
    category: 'review',
    tags: ['Roborock', 'Review', 'Robot Vacuum', 'S9 MaxV Ultra'],
  },
  {
    id: 'news-6',
    title: 'Amazon Acquires Companion Robot Startup for $500 Million',
    description: 'Tech giant Amazon has acquired social robotics company Jibo Technologies, signaling renewed interest in home companion robots.',
    content: `Amazon has announced the acquisition of Jibo Technologies, the company behind the pioneering social robot Jibo, for approximately $500 million.

The deal represents Amazons largest investment in consumer robotics since its acquisition of iRobot and signals the companys ambitions to create more interactive home robots beyond its existing Astro platform.

"Jibos team brings incredible expertise in social robotics and emotional AI," said Amazons devices chief Dave Limp. "Together, we can create robots that truly connect with families."

Jibo, which launched in 2017, was known for its expressive animations and conversational abilities. Despite a rocky start as an independent company, the technology has continued to evolve.

Industry analysts see this as the start of a new wave of companion robots designed for emotional connection rather than just functional tasks.`,
    source: { name: 'TechCrunch', url: 'https://techcrunch.com' },
    author: 'David Kim',
    url: 'https://techcrunch.com/amazon-jibo-acquisition',
    imageUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(2),
    category: 'business',
    tags: ['Amazon', 'Jibo', 'Acquisition', 'Companion Robot'],
  },
  {
    id: 'news-7',
    title: 'Husqvarna Launches Solar-Powered Robotic Lawn Mower',
    description: 'The new Automower Solar Hybrid can operate indefinitely using only solar power, eliminating the need for charging.',
    content: `Swedish outdoor power company Husqvarna has unveiled the worlds first truly solar-powered robotic lawn mower, the Automower Solar Hybrid.

The innovative mower features integrated solar panels that generate enough power for continuous operation during daylight hours, with a backup battery for cloudy days and evening use.

"This is a major step toward sustainable lawn care," said Husqvarna product manager Erik Johansson. "In most conditions, the mower never needs to return to a charging station."

Key specifications:
- 400W solar panel array
- 10Ah backup battery
- Handles lawns up to 5,000 sqm
- GPS and cellular connectivity
- Anti-theft protection

The Automower Solar Hybrid will launch in spring at $4,999, targeting environmentally conscious homeowners with large properties.`,
    source: { name: 'Engadget', url: 'https://engadget.com' },
    author: 'Lisa Park',
    url: 'https://engadget.com/husqvarna-solar-mower',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(3),
    category: 'product',
    tags: ['Husqvarna', 'Lawn Mower', 'Solar Power', 'Sustainability'],
  },
  {
    id: 'news-8',
    title: 'Educational Robot Sales Surge 40% as Schools Embrace STEM',
    description: 'Demand for coding robots and educational robotics kits is skyrocketing as schools worldwide expand their technology curricula.',
    content: `Sales of educational robots have surged 40% year-over-year as schools increasingly incorporate robotics into STEM education, according to new data from the Educational Technology Association.

Leading the growth are programmable robots from companies like Sphero, Wonder Workshop, and Makeblock, which offer age-appropriate coding experiences from kindergarten through high school.

"Weve seen a fundamental shift in how schools approach technology education," said ETA director Dr. Michael Torres. "Robots make abstract coding concepts tangible and engaging for students."

Popular educational robots include:
- Sphero BOLT for elementary students
- Makeblock mBot2 for middle schoolers
- LEGO Mindstorms for advanced learners

The trend is expected to continue as governments worldwide invest in STEM education and robotics becomes an essential skill for future careers.`,
    source: { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org' },
    author: 'Dr. Michael Torres',
    url: 'https://spectrum.ieee.org/education/stem-robotics-growth',
    imageUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(3),
    category: 'industry',
    tags: ['Education', 'STEM', 'Coding', 'Schools'],
  },
  {
    id: 'news-9',
    title: 'Sony Aibo Gets Major Update with Enhanced Emotional Intelligence',
    description: 'Sonys robot dog receives its biggest software update yet, adding new personality traits and deeper emotional responses.',
    content: `Sony has released a major software update for its Aibo robot dog that significantly enhances its emotional intelligence and personality development.

Version 4.0 introduces "Emotional Memories," allowing Aibo to form stronger bonds with family members and remember significant interactions over time. The robot can now display over 50 distinct emotional states and develop unique personality traits based on how its treated.

"Each Aibo becomes truly unique based on its experiences," said Sony robotics lead Yuki Tanaka. "Owners tell us their Aibo feels like a real member of the family."

New features include:
- Recognition of up to 100 faces
- Mood-based behavior changes
- Social interaction with other Aibos
- Advanced trick learning
- Health monitoring sensors

The update is free for all Aibo owners and will roll out automatically over the next month.`,
    source: { name: 'The Verge', url: 'https://theverge.com' },
    author: 'Emma Williams',
    url: 'https://theverge.com/sony-aibo-update-4',
    imageUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(4),
    category: 'product',
    tags: ['Sony', 'Aibo', 'Robot Dog', 'AI', 'Update'],
  },
  {
    id: 'news-10',
    title: 'New Safety Standards Proposed for Home Robots',
    description: 'International standards body proposes comprehensive safety guidelines for consumer robots operating in domestic environments.',
    content: `The International Organization for Standardization (ISO) has proposed new safety standards specifically designed for consumer robots operating in home environments.

The proposed ISO 13482-2 standard would establish requirements for:
- Collision detection and response
- Safe interaction with children and pets
- Privacy protection for camera-equipped robots
- Cybersecurity requirements
- Emergency stop functionality

"As robots become more prevalent in homes, we need clear safety guidelines," said ISO committee chair Dr. Hans Mueller. "These standards will help manufacturers build safer products and give consumers confidence."

The standards are expected to be finalized by mid-2025 and could become mandatory in several jurisdictions, including the European Union.

Major robot manufacturers including iRobot, Ecovacs, and Boston Dynamics have already expressed support for the initiative.`,
    source: { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org' },
    author: 'Dr. Hans Mueller',
    url: 'https://spectrum.ieee.org/robotics/safety-standards-home',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(4),
    category: 'industry',
    tags: ['Safety', 'Standards', 'Regulation', 'ISO'],
  },
  {
    id: 'news-11',
    title: 'Xiaomi Enters Premium Robot Vacuum Market with AI-Powered S10 Pro',
    description: 'Chinese tech giant launches its most advanced robot vacuum yet, challenging established players with aggressive pricing.',
    content: `Xiaomi has announced the Mi Robot Vacuum S10 Pro, marking the companys entry into the premium robot vacuum segment with a feature-packed device priced significantly below competitors.

At $799, the S10 Pro offers features typically found in $1,500+ devices:
- 8,000Pa suction power
- Self-emptying and self-washing dock
- Advanced LiDAR navigation
- AI obstacle recognition
- Hot water mop washing

"We believe premium cleaning technology should be accessible to everyone," said Xiaomi smart home VP Liu De. "The S10 Pro delivers flagship performance at a mid-range price."

Industry observers note this aggressive pricing could force established brands to reconsider their pricing strategies, potentially accelerating the adoption of advanced robot vacuums globally.

The S10 Pro will launch first in China and Europe, with US availability expected in Q2.`,
    source: { name: 'TechCrunch', url: 'https://techcrunch.com' },
    author: 'Kevin Lee',
    url: 'https://techcrunch.com/xiaomi-s10-pro-launch',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(5),
    category: 'product',
    tags: ['Xiaomi', 'Robot Vacuum', 'S10 Pro', 'AI'],
  },
  {
    id: 'news-12',
    title: 'Skydio Launches Consumer Drone with Fully Autonomous Flying',
    description: 'American drone maker releases its first consumer-focused drone that requires zero piloting skills to operate.',
    content: `Skydio, known for its autonomous drones used by first responders and enterprises, has launched the Skydio X1, its first drone designed specifically for consumers.

The X1 features the companys industry-leading autonomous flight technology, allowing anyone to capture professional-quality aerial footage without any piloting experience.

"Traditional drones require significant skill to fly well," said Skydio CEO Adam Bry. "The X1 handles all the flying so you can focus on creativity."

Key features:
- One-button takeoff and landing
- Subject tracking for sports and outdoor activities
- 360-degree obstacle avoidance
- 35-minute flight time
- 4K/60fps camera with 3-axis stabilization

The Skydio X1 is priced at $999, positioning it as a premium alternative to DJIs consumer lineup. Pre-orders are now open with shipping expected within 60 days.`,
    source: { name: 'Wired', url: 'https://wired.com' },
    author: 'Chris Martin',
    url: 'https://wired.com/skydio-x1-consumer-drone',
    imageUrl: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=400&fit=crop',
    publishedAt: getRelativeDate(5),
    category: 'product',
    tags: ['Skydio', 'Drone', 'Autonomous', 'Consumer'],
  },
];

// Function to generate fresh articles with current dates
export function getLatestNews(): NewsArticle[] {
  return mockNewsArticles.map((article, index) => ({
    ...article,
    publishedAt: getRelativeDate(Math.floor(index / 2)),
  }));
}

// Simulated function to fetch news from external sources
export async function fetchExternalNews(): Promise<NewsArticle[]> {
  // In production, this would call external APIs like:
  // - NewsAPI (newsapi.org)
  // - Google News RSS feeds
  // - Tech site RSS feeds (TechCrunch, Verge, etc.)

  // For now, return mock data with fresh timestamps
  return getLatestNews();
}
