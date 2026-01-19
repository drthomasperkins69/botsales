"""
BotSales.com Demo Data Seeder
Creates sample data for demonstration purposes.
"""
from datetime import datetime, timedelta
import random


def seed_database(db):
    """Seed the database with demo data"""
    from models import User, Listing, Article

    # Clear existing data
    db.session.query(Listing).delete()
    db.session.query(Article).delete()
    # Keep users to avoid foreign key issues

    # Create demo users
    users = []
    demo_users = [
        ('admin', 'admin@botsales.com', 'Admin', 'User', True, 'dealer'),
        ('robotking', 'robotking@example.com', 'James', 'Wilson', False, 'dealer'),
        ('techseller', 'techseller@example.com', 'Sarah', 'Chen', True, 'private'),
        ('botdealer', 'botdealer@example.com', 'Mike', 'Johnson', True, 'dealer'),
        ('homeauto', 'homeauto@example.com', 'Emily', 'Davis', False, 'private'),
    ]

    for username, email, first, last, verified, seller_type in demo_users:
        existing = User.query.filter_by(email=email).first()
        if existing:
            users.append(existing)
            continue

        user = User(
            username=username,
            email=email,
            first_name=first,
            last_name=last,
            is_verified=verified,
            seller_type=seller_type,
            location='Sydney',
            state='NSW',
            postcode='2000',
            is_admin=(username == 'admin')
        )
        user.set_password('password123')
        db.session.add(user)
        users.append(user)

    db.session.flush()

    # Create demo listings
    listings_data = [
        {
            'title': 'Boston Dynamics Spot - Enterprise Edition',
            'description': '''Selling my Boston Dynamics Spot robot in excellent condition. This is the Enterprise Edition with all premium features included.

The robot has been used primarily for facility inspection and remote monitoring. It comes with:
- Full suite of sensors including LIDAR and cameras
- Extra battery pack (3 total)
- Charging dock
- Spot CAM+
- Custom payload mount
- Original packaging and documentation

Battery life is excellent, typically getting 90 minutes per charge. All software is up to date and ready for transfer to new owner.

Reason for selling: Company downsizing. This robot has been well maintained by our robotics team.''',
            'category': 'industrial',
            'brand': 'Boston Dynamics',
            'model': 'Spot Enterprise',
            'year': 2023,
            'condition': 'excellent',
            'price': 74500,
            'height': 84,
            'weight': 32,
            'battery_life': 90,
            'connectivity': 'WiFi, Ethernet, 4G LTE',
            'features': 'Autonomous navigation, LIDAR, 360° cameras, Spot CAM+',
            'state': 'NSW',
            'location': 'Sydney',
            'is_featured': True,
        },
        {
            'title': 'iRobot Roomba j9+ with Clean Base - Like New',
            'description': '''Selling my iRobot Roomba j9+ that I purchased just 3 months ago. Moving to an apartment with hard floors only so no longer need it.

Features:
- Self-emptying Clean Base
- PrecisionVision Navigation
- Pet owner optimized
- Ideal for homes with carpet and hard floors

Comes with all original accessories including extra filters and brushes. Still under warranty.''',
            'category': 'domestic',
            'brand': 'iRobot',
            'model': 'Roomba j9+',
            'year': 2024,
            'condition': 'like_new',
            'price': 1299,
            'height': 10,
            'weight': 3.4,
            'battery_life': 2,
            'connectivity': 'WiFi, Bluetooth',
            'features': 'Self-emptying, Smart mapping, Pet hair detection',
            'state': 'VIC',
            'location': 'Melbourne',
            'is_featured': True,
        },
        {
            'title': 'SoftBank Pepper Humanoid Robot - Commercial Use',
            'description': '''SoftBank Pepper robot available for sale. Previously used in our retail store for customer engagement.

Pepper has been a reliable assistant for greeting customers and providing information. Fully functional with all features working:
- Emotion recognition
- Natural language processing
- Multi-language support (English, Japanese, French)
- Touch screen tablet
- Autonomous movement

Includes charging station and maintenance kit. Software license can be transferred.''',
            'category': 'commercial',
            'brand': 'SoftBank Robotics',
            'model': 'Pepper',
            'year': 2022,
            'condition': 'good',
            'price': 28000,
            'height': 120,
            'weight': 28,
            'battery_life': 12,
            'connectivity': 'WiFi, Ethernet',
            'features': 'Speech recognition, Emotion detection, Tablet interface',
            'state': 'QLD',
            'location': 'Brisbane',
            'is_featured': True,
        },
        {
            'title': 'DJI RoboMaster S1 Educational Robot - Complete Kit',
            'description': '''DJI RoboMaster S1 educational robot with all accessories. Perfect for teaching kids about programming and robotics.

Includes:
- RoboMaster S1 robot
- Extra gel beads (5000+)
- Carry case
- Extra battery
- Vision markers set
- All original packaging

Great for STEM education. Supports Scratch and Python programming. Has been used gently and is in excellent condition.''',
            'category': 'educational',
            'brand': 'DJI',
            'model': 'RoboMaster S1',
            'year': 2023,
            'condition': 'excellent',
            'price': 750,
            'height': 27,
            'weight': 3.3,
            'battery_life': 0.5,
            'connectivity': 'WiFi, Bluetooth',
            'features': 'FPV camera, AI vision, Scratch/Python programming',
            'state': 'NSW',
            'location': 'Sydney',
            'is_featured': False,
        },
        {
            'title': 'Unitree Go2 Pro Quadruped Robot Dog',
            'description': '''Brand new Unitree Go2 Pro still in original packaging. Won this in a tech competition but already have one.

The Go2 Pro features:
- 4D LIDAR for obstacle avoidance
- AI companion features
- Voice commands
- Mobile app control
- SDK for custom development

This is the Pro version with enhanced sensors and longer battery life. Full warranty included.''',
            'category': 'companion',
            'brand': 'Unitree',
            'model': 'Go2 Pro',
            'year': 2024,
            'condition': 'new',
            'price': 2800,
            'height': 40,
            'weight': 15,
            'battery_life': 2,
            'connectivity': 'WiFi, Bluetooth, 4G',
            'features': '4D LIDAR, AI companion, Voice control, SDK access',
            'state': 'VIC',
            'location': 'Melbourne',
            'is_featured': True,
        },
        {
            'title': 'Roborock S8 Pro Ultra Robot Vacuum & Mop',
            'description': '''Top of the line Roborock S8 Pro Ultra with auto empty dock. Only 6 months old, selling due to relocation.

Features:
- 6000Pa suction power
- Dual rubber brushes
- Sonic mopping with hot water
- Self-washing and drying
- Auto-empty and refill dock

Multi-level mapping saved for 3-story home. Works perfectly with Google Home and Alexa.''',
            'category': 'domestic',
            'brand': 'Roborock',
            'model': 'S8 Pro Ultra',
            'year': 2024,
            'condition': 'like_new',
            'price': 1800,
            'height': 9.6,
            'weight': 4.2,
            'battery_life': 3,
            'connectivity': 'WiFi',
            'features': 'Self-emptying, Self-washing mop, Hot water cleaning',
            'state': 'SA',
            'location': 'Adelaide',
            'is_featured': False,
        },
        {
            'title': 'UBTECH Alpha 1 Pro Humanoid Robot',
            'description': '''UBTECH Alpha 1 Pro programmable humanoid robot. Great for education and entertainment.

Features 16 servo motors for smooth movement. Can be programmed via mobile app with visual programming interface. Includes:
- Alpha 1 Pro robot
- Charging cable
- Quick start guide

Perfect for learning robotics programming. Used in classroom setting, works perfectly.''',
            'category': 'educational',
            'brand': 'UBTECH',
            'model': 'Alpha 1 Pro',
            'year': 2022,
            'condition': 'good',
            'price': 450,
            'height': 40,
            'weight': 1.7,
            'battery_life': 1,
            'connectivity': 'Bluetooth',
            'features': '16 servo motors, Visual programming, Dance/action presets',
            'state': 'WA',
            'location': 'Perth',
            'is_featured': False,
        },
        {
            'title': 'Anki Vector Robot - Collector\'s Item',
            'description': '''Original Anki Vector robot in great condition. Rare collector's item as Anki is no longer in business.

Vector is a home companion robot with personality. Features:
- Facial recognition
- Voice commands (Alexa built-in)
- Self-charging
- Expressive animations

Note: Subscription service now run by Digital Dream Labs. Robot works perfectly offline too.''',
            'category': 'companion',
            'brand': 'Anki',
            'model': 'Vector',
            'year': 2019,
            'condition': 'good',
            'price': 350,
            'height': 10,
            'weight': 0.3,
            'battery_life': 0.5,
            'connectivity': 'WiFi, Bluetooth',
            'features': 'Facial recognition, Alexa integration, Self-charging',
            'state': 'NSW',
            'location': 'Newcastle',
            'is_featured': False,
        },
        {
            'title': 'Universal Robots UR5e Collaborative Robot Arm',
            'description': '''Universal Robots UR5e cobot available for immediate sale. Previously used in manufacturing line for pick and place operations.

Specifications:
- 5kg payload capacity
- 850mm reach
- Force sensing in all joints
- Polyscope programming interface

Includes teach pendant, cables, and mounting hardware. Has been professionally maintained. Ideal for small-medium manufacturing operations.''',
            'category': 'industrial',
            'brand': 'Universal Robots',
            'model': 'UR5e',
            'year': 2021,
            'condition': 'good',
            'price': 32000,
            'height': 85,
            'weight': 20.6,
            'connectivity': 'Ethernet, Modbus, PROFINET',
            'features': '6-axis, Force sensing, Collaborative safety',
            'state': 'VIC',
            'location': 'Geelong',
            'is_featured': True,
        },
        {
            'title': 'Sphero BOLT Educational Robot Set (10 pack)',
            'description': '''Complete classroom set of 10 Sphero BOLT robots with charging cradles. Perfect for schools or coding clubs.

Each BOLT features:
- Programmable LED matrix
- Light, compass, gyroscope sensors
- Infrared communication
- Waterproof shell

All 10 robots tested and working. Includes charging cradles and activity cards. Compatible with Sphero Edu app for Scratch and JavaScript programming.''',
            'category': 'educational',
            'brand': 'Sphero',
            'model': 'BOLT',
            'year': 2023,
            'condition': 'excellent',
            'price': 2500,
            'height': 7.3,
            'weight': 0.2,
            'battery_life': 2,
            'connectivity': 'Bluetooth',
            'features': 'LED matrix, Multi-sensors, Group activities support',
            'state': 'ACT',
            'location': 'Canberra',
            'is_featured': False,
        },
    ]

    for i, data in enumerate(listings_data):
        seller = random.choice(users[1:])  # Don't use admin as seller
        listing = Listing(
            seller_id=seller.id,
            title=data['title'],
            description=data['description'],
            category=data['category'],
            brand=data['brand'],
            model=data['model'],
            year=data['year'],
            condition=data['condition'],
            price=data['price'],
            height=data.get('height'),
            weight=data.get('weight'),
            battery_life=data.get('battery_life'),
            connectivity=data.get('connectivity'),
            features=data.get('features'),
            location=data['location'],
            state=data['state'],
            postcode='2000',
            is_featured=data['is_featured'],
            status='active',
            views=random.randint(50, 500),
            inquiries=random.randint(2, 20),
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            expires_at=datetime.utcnow() + timedelta(days=random.randint(30, 60))
        )
        db.session.add(listing)
        db.session.flush()
        listing.generate_slug()

    # Create demo articles
    articles_data = [
        {
            'title': 'Top 10 Home Robots for 2026',
            'excerpt': 'Our comprehensive guide to the best home robots available this year, from vacuums to companions.',
            'category': 'guide',
            'content': '''Home robotics has come a long way in recent years. Here are our top picks for 2026...

## 1. iRobot Roomba j9+
The latest in autonomous cleaning technology with exceptional navigation and self-emptying capabilities.

## 2. Roborock S8 Pro Ultra
Premium vacuum and mop combo with hot water cleaning and self-maintenance dock.

## 3. Unitree Go2 Pro
The most advanced consumer robot dog, perfect for companionship and entertainment.

...and more recommendations in our full guide.'''
        },
        {
            'title': 'Boston Dynamics Spot: A Comprehensive Review',
            'excerpt': 'We spent 3 months with the Spot robot. Here\'s everything you need to know before buying.',
            'category': 'review',
            'content': '''After extensive testing of the Boston Dynamics Spot, we can confidently say this is the most capable quadruped robot available today.

## Build Quality
Exceptional. The Spot is built to withstand industrial environments...

## Navigation
The autonomous navigation is remarkably reliable...

## Value for Money
At $74,500 for the Explorer package, Spot isn't cheap...'''
        },
        {
            'title': 'The Rise of Companion Robots: What You Need to Know',
            'excerpt': 'Social robots are becoming increasingly popular. We explore the trend and what it means for consumers.',
            'category': 'news',
            'content': '''The companion robot market has grown 300% in the past two years. From the simple Anki Vector to sophisticated humanoids like Pepper, robots are becoming part of our daily lives.

Key trends we're seeing:
- Increased emotional intelligence in robot design
- Better natural language processing
- More affordable price points
- Integration with smart home systems

What does this mean for you?...'''
        },
    ]

    admin = users[0]
    for data in articles_data:
        import re
        slug = re.sub(r'[^\w\s-]', '', data['title'].lower())
        slug = re.sub(r'[-\s]+', '-', slug).strip('-')

        article = Article(
            author_id=admin.id,
            title=data['title'],
            slug=slug,
            excerpt=data['excerpt'],
            content=data['content'],
            category=data['category'],
            status='published',
            is_featured=(data['category'] == 'guide'),
            views=random.randint(100, 1000),
            published_at=datetime.utcnow() - timedelta(days=random.randint(1, 14))
        )
        db.session.add(article)

    db.session.commit()
    print('Demo data seeded successfully!')
    print(f'Created {len(users)} users')
    print(f'Created {len(listings_data)} listings')
    print(f'Created {len(articles_data)} articles')
