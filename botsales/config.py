"""
BotSales.com Configuration
"""
import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'botsales-dev-key-change-in-production'

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///botsales.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    # Pagination
    LISTINGS_PER_PAGE = 20
    MESSAGES_PER_PAGE = 50

    # Email settings (configure for production)
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    # Robot categories and types
    ROBOT_CATEGORIES = [
        ('domestic', 'Domestic & Home'),
        ('industrial', 'Industrial & Manufacturing'),
        ('educational', 'Educational & STEM'),
        ('companion', 'Companion & Social'),
        ('security', 'Security & Surveillance'),
        ('agricultural', 'Agricultural & Farming'),
        ('medical', 'Medical & Healthcare'),
        ('entertainment', 'Entertainment & Hobby'),
        ('commercial', 'Commercial & Service'),
        ('custom', 'Custom & DIY'),
    ]

    ROBOT_CONDITIONS = [
        ('new', 'Brand New'),
        ('like_new', 'Like New'),
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('parts', 'For Parts/Not Working'),
    ]

    SELLER_TYPES = [
        ('private', 'Private Seller'),
        ('dealer', 'Dealer'),
        ('manufacturer', 'Manufacturer'),
    ]

    # Popular robot brands
    ROBOT_BRANDS = [
        'Boston Dynamics',
        'iRobot',
        'DJI',
        'Anki',
        'SoftBank Robotics',
        'UBTECH',
        'Makeblock',
        'Sphero',
        'Wonder Workshop',
        'Lego',
        'Roborock',
        'Ecovacs',
        'Neato',
        'Samsung',
        'LG',
        'Tesla',
        'Figure AI',
        'Agility Robotics',
        'Unitree',
        'Xiaomi',
        'ABB',
        'KUKA',
        'FANUC',
        'Universal Robots',
        'Other',
    ]


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}
