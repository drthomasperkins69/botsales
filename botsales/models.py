"""
BotSales.com Database Models
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


# Association table for saved listings
saved_listings = db.Table('saved_listings',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('listing_id', db.Integer, db.ForeignKey('listings.id'), primary_key=True),
    db.Column('saved_at', db.DateTime, default=datetime.utcnow)
)


class User(UserMixin, db.Model):
    """User model for authentication and profiles"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)

    # Profile info
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    state = db.Column(db.String(50))
    postcode = db.Column(db.String(10))
    avatar = db.Column(db.String(255))
    bio = db.Column(db.Text)

    # Account settings
    seller_type = db.Column(db.String(20), default='private')  # private, dealer, manufacturer
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)

    # Notification preferences
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Relationships
    listings = db.relationship('Listing', backref='seller', lazy='dynamic', foreign_keys='Listing.seller_id')
    saved = db.relationship('Listing', secondary=saved_listings, backref='saved_by', lazy='dynamic')
    sent_messages = db.relationship('Message', backref='sender', lazy='dynamic', foreign_keys='Message.sender_id')
    received_messages = db.relationship('Message', backref='recipient', lazy='dynamic', foreign_keys='Message.recipient_id')
    reviews_given = db.relationship('Review', backref='reviewer', lazy='dynamic', foreign_keys='Review.reviewer_id')
    reviews_received = db.relationship('Review', backref='reviewed_user', lazy='dynamic', foreign_keys='Review.reviewed_user_id')
    search_alerts = db.relationship('SearchAlert', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username

    @property
    def rating(self):
        reviews = self.reviews_received.all()
        if not reviews:
            return None
        return sum(r.rating for r in reviews) / len(reviews)

    @property
    def unread_message_count(self):
        return self.received_messages.filter_by(is_read=False).count()

    def __repr__(self):
        return f'<User {self.username}>'


class Listing(db.Model):
    """Robot listing model"""
    __tablename__ = 'listings'

    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    # Basic info
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(250), unique=True, index=True)
    description = db.Column(db.Text, nullable=False)

    # Robot details
    category = db.Column(db.String(50), nullable=False, index=True)
    brand = db.Column(db.String(100), index=True)
    model = db.Column(db.String(100), index=True)
    year = db.Column(db.Integer, index=True)
    condition = db.Column(db.String(20), nullable=False)

    # Specifications
    height = db.Column(db.Float)  # in cm
    weight = db.Column(db.Float)  # in kg
    battery_life = db.Column(db.Integer)  # in hours
    connectivity = db.Column(db.String(200))  # WiFi, Bluetooth, etc.
    features = db.Column(db.Text)  # JSON array of features
    specifications = db.Column(db.Text)  # JSON object of specs

    # Pricing
    price = db.Column(db.Float, nullable=False, index=True)
    price_negotiable = db.Column(db.Boolean, default=False)
    original_price = db.Column(db.Float)  # For showing discount

    # Location
    location = db.Column(db.String(100), index=True)
    state = db.Column(db.String(50), index=True)
    postcode = db.Column(db.String(10), index=True)

    # Status
    status = db.Column(db.String(20), default='active', index=True)  # active, sold, expired, pending, rejected
    is_featured = db.Column(db.Boolean, default=False, index=True)
    is_urgent = db.Column(db.Boolean, default=False)

    # Media
    primary_image = db.Column(db.String(255))

    # Stats
    views = db.Column(db.Integer, default=0)
    inquiries = db.Column(db.Integer, default=0)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    sold_at = db.Column(db.DateTime)

    # Relationships
    images = db.relationship('ListingImage', backref='listing', lazy='dynamic', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='listing', lazy='dynamic')

    def generate_slug(self):
        """Generate URL-friendly slug from title"""
        import re
        slug = self.title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug).strip('-')
        self.slug = f"{slug}-{self.id}"

    @property
    def is_active(self):
        return self.status == 'active' and (not self.expires_at or self.expires_at > datetime.utcnow())

    @property
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price:
            return int(((self.original_price - self.price) / self.original_price) * 100)
        return None

    def __repr__(self):
        return f'<Listing {self.title}>'


class ListingImage(db.Model):
    """Images for listings"""
    __tablename__ = 'listing_images'

    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ListingImage {self.filename}>'


class Message(db.Model):
    """Messaging system between buyers and sellers"""
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), index=True)

    # Thread tracking
    thread_id = db.Column(db.String(100), index=True)  # Groups messages in conversation

    subject = db.Column(db.String(200))
    body = db.Column(db.Text, nullable=False)

    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()

    def __repr__(self):
        return f'<Message {self.id}>'


class Review(db.Model):
    """User reviews and ratings"""
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    reviewed_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), index=True)

    rating = db.Column(db.Integer, nullable=False)  # 1-5
    title = db.Column(db.String(100))
    comment = db.Column(db.Text)

    # Review type
    review_type = db.Column(db.String(20), default='seller')  # seller or buyer

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Review {self.id}>'


class SearchAlert(db.Model):
    """Saved search alerts for users"""
    __tablename__ = 'search_alerts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    name = db.Column(db.String(100))

    # Search criteria (stored as JSON)
    criteria = db.Column(db.Text, nullable=False)  # JSON object

    # Alert settings
    frequency = db.Column(db.String(20), default='instant')  # instant, daily, weekly
    is_active = db.Column(db.Boolean, default=True)

    last_sent = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<SearchAlert {self.name}>'


class Article(db.Model):
    """News and research articles"""
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(250), unique=True, index=True)
    excerpt = db.Column(db.String(500))
    content = db.Column(db.Text, nullable=False)

    # Categorization
    category = db.Column(db.String(50), index=True)  # news, review, guide, comparison
    tags = db.Column(db.Text)  # JSON array

    # Media
    featured_image = db.Column(db.String(255))

    # Status
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    is_featured = db.Column(db.Boolean, default=False)

    # Stats
    views = db.Column(db.Integer, default=0)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)

    # Relationships
    author = db.relationship('User', backref='articles')

    def __repr__(self):
        return f'<Article {self.title}>'


class Report(db.Model):
    """User reports for listings or users"""
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # What's being reported
    listing_id = db.Column(db.Integer, db.ForeignKey('listings.id'), index=True)
    reported_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)

    reason = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

    status = db.Column(db.String(20), default='pending')  # pending, reviewed, resolved, dismissed
    admin_notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)

    # Relationships
    reporter = db.relationship('User', foreign_keys=[reporter_id], backref='reports_submitted')
    reported_user = db.relationship('User', foreign_keys=[reported_user_id], backref='reports_received')
    listing = db.relationship('Listing', backref='reports')

    def __repr__(self):
        return f'<Report {self.id}>'


class SiteSettings(db.Model):
    """Site-wide settings"""
    __tablename__ = 'site_settings'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<SiteSettings {self.key}>'
