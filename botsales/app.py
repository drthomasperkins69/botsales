"""
BotSales.com - Robot Marketplace Application
Buy It. Sell It. Love It.
"""
import os
import json
import uuid
import re
from datetime import datetime, timedelta
from functools import wraps

from flask import (
    Flask, render_template, request, redirect, url_for, flash,
    jsonify, abort, send_from_directory, session
)
from flask_login import (
    LoginManager, login_user, logout_user, login_required, current_user
)
from werkzeug.utils import secure_filename

from config import config
from models import (
    db, User, Listing, ListingImage, Message, Review,
    SearchAlert, Article, Report, SiteSettings
)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config[os.environ.get('FLASK_ENV', 'development')])

# Initialize extensions
db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function


def generate_thread_id(user1_id, user2_id, listing_id):
    """Generate consistent thread ID for conversations"""
    ids = sorted([user1_id, user2_id])
    return f"{ids[0]}-{ids[1]}-{listing_id}"


# =============================================================================
# CONTEXT PROCESSORS
# =============================================================================

@app.context_processor
def inject_globals():
    """Inject global variables into all templates"""
    from config import Config
    return {
        'categories': Config.ROBOT_CATEGORIES,
        'brands': Config.ROBOT_BRANDS,
        'conditions': Config.ROBOT_CONDITIONS,
        'current_year': datetime.now().year,
    }


# =============================================================================
# HOME & STATIC PAGES
# =============================================================================

@app.route('/')
def home():
    """Homepage with search and featured listings"""
    # Get featured listings
    featured = Listing.query.filter_by(
        status='active', is_featured=True
    ).order_by(Listing.created_at.desc()).limit(8).all()

    # Get latest listings
    latest = Listing.query.filter_by(
        status='active'
    ).order_by(Listing.created_at.desc()).limit(12).all()

    # Get category counts
    category_counts = db.session.query(
        Listing.category, db.func.count(Listing.id)
    ).filter_by(status='active').group_by(Listing.category).all()

    # Get popular brands
    popular_brands = db.session.query(
        Listing.brand, db.func.count(Listing.id).label('count')
    ).filter(Listing.status == 'active', Listing.brand.isnot(None)
    ).group_by(Listing.brand).order_by(db.desc('count')).limit(10).all()

    return render_template('home.html',
        featured=featured,
        latest=latest,
        category_counts=dict(category_counts),
        popular_brands=popular_brands
    )


@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page"""
    if request.method == 'POST':
        # Handle contact form submission
        flash('Your message has been sent. We\'ll get back to you soon!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')


@app.route('/safety')
def safety():
    """Trust & Safety page"""
    return render_template('safety.html')


@app.route('/help')
def help_page():
    """Help center"""
    return render_template('help.html')


@app.route('/terms')
def terms():
    """Terms of service"""
    return render_template('terms.html')


@app.route('/privacy')
def privacy():
    """Privacy policy"""
    return render_template('privacy.html')


# =============================================================================
# AUTHENTICATION
# =============================================================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        remember = request.form.get('remember', False)

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            if not user.is_active:
                flash('Your account has been deactivated. Please contact support.', 'danger')
                return redirect(url_for('login'))

            login_user(user, remember=remember)
            user.last_login = datetime.utcnow()
            db.session.commit()

            next_page = request.args.get('next')
            flash('Welcome back!', 'success')
            return redirect(next_page if next_page else url_for('home'))

        flash('Invalid email or password.', 'danger')

    return render_template('auth/login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        confirm = request.form.get('confirm_password', '')

        errors = []

        # Validation
        if not email or '@' not in email:
            errors.append('Please enter a valid email address.')
        if not username or len(username) < 3:
            errors.append('Username must be at least 3 characters.')
        if not password or len(password) < 8:
            errors.append('Password must be at least 8 characters.')
        if password != confirm:
            errors.append('Passwords do not match.')

        # Check existing users
        if User.query.filter_by(email=email).first():
            errors.append('An account with this email already exists.')
        if User.query.filter_by(username=username).first():
            errors.append('This username is already taken.')

        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template('auth/register.html')

        # Create user
        user = User(email=email, username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        flash('Welcome to BotSales! Your account has been created.', 'success')
        return redirect(url_for('home'))

    return render_template('auth/register.html')


@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Password reset request"""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        user = User.query.filter_by(email=email).first()
        # Always show success message to prevent email enumeration
        flash('If an account exists with that email, you will receive password reset instructions.', 'info')
        return redirect(url_for('login'))
    return render_template('auth/forgot_password.html')


# =============================================================================
# SEARCH & LISTINGS
# =============================================================================

@app.route('/search')
def search():
    """Search listings with filters"""
    page = request.args.get('page', 1, type=int)

    # Base query
    query = Listing.query.filter_by(status='active')

    # Text search
    q = request.args.get('q', '').strip()
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            db.or_(
                Listing.title.ilike(search_term),
                Listing.description.ilike(search_term),
                Listing.brand.ilike(search_term),
                Listing.model.ilike(search_term)
            )
        )

    # Category filter
    category = request.args.get('category')
    if category:
        query = query.filter_by(category=category)

    # Brand filter
    brand = request.args.get('brand')
    if brand:
        query = query.filter_by(brand=brand)

    # Condition filter
    condition = request.args.get('condition')
    if condition:
        query = query.filter_by(condition=condition)

    # Price range
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    if min_price:
        query = query.filter(Listing.price >= min_price)
    if max_price:
        query = query.filter(Listing.price <= max_price)

    # Year range
    min_year = request.args.get('min_year', type=int)
    max_year = request.args.get('max_year', type=int)
    if min_year:
        query = query.filter(Listing.year >= min_year)
    if max_year:
        query = query.filter(Listing.year <= max_year)

    # Location filters
    state = request.args.get('state')
    if state:
        query = query.filter_by(state=state)

    postcode = request.args.get('postcode')
    if postcode:
        query = query.filter(Listing.postcode.like(f"{postcode}%"))

    # Seller type
    seller_type = request.args.get('seller_type')
    if seller_type:
        query = query.join(User).filter(User.seller_type == seller_type)

    # Sorting
    sort = request.args.get('sort', 'newest')
    if sort == 'price_low':
        query = query.order_by(Listing.price.asc())
    elif sort == 'price_high':
        query = query.order_by(Listing.price.desc())
    elif sort == 'oldest':
        query = query.order_by(Listing.created_at.asc())
    else:  # newest
        query = query.order_by(Listing.created_at.desc())

    # Featured first option
    if request.args.get('featured_first'):
        query = query.order_by(Listing.is_featured.desc())

    # Pagination
    listings = query.paginate(
        page=page,
        per_page=app.config['LISTINGS_PER_PAGE'],
        error_out=False
    )

    # Get filter options for sidebar
    from config import Config
    states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

    return render_template('search/results.html',
        listings=listings,
        query=q,
        filters=request.args,
        states=states
    )


@app.route('/listing/<int:id>')
@app.route('/listing/<int:id>/<slug>')
def listing_detail(id, slug=None):
    """Individual listing page"""
    listing = Listing.query.get_or_404(id)

    # Redirect to canonical URL with slug
    if not slug or slug != listing.slug:
        if listing.slug:
            return redirect(url_for('listing_detail', id=id, slug=listing.slug), code=301)

    # Increment view count (simple implementation)
    if not session.get(f'viewed_{id}'):
        listing.views += 1
        db.session.commit()
        session[f'viewed_{id}'] = True

    # Get similar listings
    similar = Listing.query.filter(
        Listing.id != id,
        Listing.status == 'active',
        db.or_(
            Listing.category == listing.category,
            Listing.brand == listing.brand
        )
    ).order_by(db.func.random()).limit(4).all()

    # Check if user has saved this listing
    is_saved = False
    if current_user.is_authenticated:
        is_saved = listing in current_user.saved.all()

    return render_template('listings/detail.html',
        listing=listing,
        similar=similar,
        is_saved=is_saved
    )


@app.route('/category/<category>')
def category_listings(category):
    """Listings by category"""
    # Validate category
    from config import Config
    valid_categories = [c[0] for c in Config.ROBOT_CATEGORIES]
    if category not in valid_categories:
        abort(404)

    return redirect(url_for('search', category=category))


@app.route('/brand/<brand>')
def brand_listings(brand):
    """Listings by brand"""
    return redirect(url_for('search', brand=brand))


# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.route('/api/search/suggestions')
def search_suggestions():
    """Autocomplete suggestions for search"""
    q = request.args.get('q', '').strip()
    if len(q) < 2:
        return jsonify([])

    search_term = f"%{q}%"

    # Get matching brands
    brands = db.session.query(Listing.brand).filter(
        Listing.brand.ilike(search_term),
        Listing.status == 'active'
    ).distinct().limit(5).all()

    # Get matching models
    models = db.session.query(Listing.brand, Listing.model).filter(
        db.or_(
            Listing.model.ilike(search_term),
            Listing.title.ilike(search_term)
        ),
        Listing.status == 'active'
    ).distinct().limit(5).all()

    suggestions = []
    for brand, in brands:
        if brand:
            suggestions.append({'type': 'brand', 'text': brand})

    for brand, model in models:
        if model:
            text = f"{brand} {model}" if brand else model
            suggestions.append({'type': 'model', 'text': text})

    return jsonify(suggestions[:8])


@app.route('/api/listing/<int:id>/save', methods=['POST'])
@login_required
def toggle_save_listing(id):
    """Toggle save/unsave listing"""
    listing = Listing.query.get_or_404(id)

    if listing in current_user.saved.all():
        current_user.saved.remove(listing)
        saved = False
    else:
        current_user.saved.append(listing)
        saved = True

    db.session.commit()
    return jsonify({'saved': saved})


@app.route('/api/listings/count')
def listings_count():
    """Get count of listings matching filters"""
    query = Listing.query.filter_by(status='active')

    category = request.args.get('category')
    if category:
        query = query.filter_by(category=category)

    brand = request.args.get('brand')
    if brand:
        query = query.filter_by(brand=brand)

    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    if min_price:
        query = query.filter(Listing.price >= min_price)
    if max_price:
        query = query.filter(Listing.price <= max_price)

    return jsonify({'count': query.count()})


# =============================================================================
# CREATE / MANAGE LISTINGS
# =============================================================================

@app.route('/sell')
def sell():
    """Sell landing page"""
    return render_template('sell/index.html')


@app.route('/sell/create', methods=['GET', 'POST'])
@login_required
def create_listing():
    """Create new listing"""
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title', '').strip()
        description = request.form.get('description', '').strip()
        category = request.form.get('category')
        brand = request.form.get('brand')
        model = request.form.get('model', '').strip()
        year = request.form.get('year', type=int)
        condition = request.form.get('condition')
        price = request.form.get('price', type=float)
        location = request.form.get('location', '').strip()
        state = request.form.get('state')
        postcode = request.form.get('postcode', '').strip()

        # Validation
        errors = []
        if not title or len(title) < 10:
            errors.append('Title must be at least 10 characters.')
        if not description or len(description) < 50:
            errors.append('Description must be at least 50 characters.')
        if not category:
            errors.append('Please select a category.')
        if not condition:
            errors.append('Please select the condition.')
        if not price or price <= 0:
            errors.append('Please enter a valid price.')

        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template('sell/create.html', form_data=request.form)

        # Create listing
        listing = Listing(
            seller_id=current_user.id,
            title=title,
            description=description,
            category=category,
            brand=brand if brand != 'Other' else request.form.get('brand_other', '').strip(),
            model=model,
            year=year,
            condition=condition,
            price=price,
            price_negotiable=request.form.get('negotiable') == 'on',
            location=location,
            state=state,
            postcode=postcode,
            height=request.form.get('height', type=float),
            weight=request.form.get('weight', type=float),
            battery_life=request.form.get('battery_life', type=int),
            connectivity=request.form.get('connectivity', '').strip(),
            features=request.form.get('features', '').strip(),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )

        db.session.add(listing)
        db.session.flush()  # Get the ID

        # Generate slug
        listing.generate_slug()

        # Handle image uploads
        files = request.files.getlist('images')
        for i, file in enumerate(files):
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = f"{listing.id}_{uuid.uuid4().hex}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)

                image = ListingImage(
                    listing_id=listing.id,
                    filename=unique_filename,
                    is_primary=(i == 0),
                    order=i
                )
                db.session.add(image)

                if i == 0:
                    listing.primary_image = unique_filename

        db.session.commit()

        flash('Your listing has been created!', 'success')
        return redirect(url_for('listing_detail', id=listing.id, slug=listing.slug))

    return render_template('sell/create.html')


@app.route('/sell/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_listing(id):
    """Edit existing listing"""
    listing = Listing.query.get_or_404(id)

    if listing.seller_id != current_user.id and not current_user.is_admin:
        abort(403)

    if request.method == 'POST':
        listing.title = request.form.get('title', '').strip()
        listing.description = request.form.get('description', '').strip()
        listing.category = request.form.get('category')
        listing.brand = request.form.get('brand')
        listing.model = request.form.get('model', '').strip()
        listing.year = request.form.get('year', type=int)
        listing.condition = request.form.get('condition')
        listing.price = request.form.get('price', type=float)
        listing.price_negotiable = request.form.get('negotiable') == 'on'
        listing.location = request.form.get('location', '').strip()
        listing.state = request.form.get('state')
        listing.postcode = request.form.get('postcode', '').strip()
        listing.height = request.form.get('height', type=float)
        listing.weight = request.form.get('weight', type=float)
        listing.battery_life = request.form.get('battery_life', type=int)
        listing.connectivity = request.form.get('connectivity', '').strip()
        listing.features = request.form.get('features', '').strip()

        # Handle new image uploads
        files = request.files.getlist('images')
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = f"{listing.id}_{uuid.uuid4().hex}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)

                image = ListingImage(
                    listing_id=listing.id,
                    filename=unique_filename,
                    order=listing.images.count()
                )
                db.session.add(image)

        db.session.commit()

        flash('Listing updated successfully!', 'success')
        return redirect(url_for('listing_detail', id=listing.id, slug=listing.slug))

    return render_template('sell/edit.html', listing=listing)


@app.route('/sell/delete/<int:id>', methods=['POST'])
@login_required
def delete_listing(id):
    """Delete a listing"""
    listing = Listing.query.get_or_404(id)

    if listing.seller_id != current_user.id and not current_user.is_admin:
        abort(403)

    db.session.delete(listing)
    db.session.commit()

    flash('Listing deleted.', 'info')
    return redirect(url_for('dashboard'))


@app.route('/sell/mark-sold/<int:id>', methods=['POST'])
@login_required
def mark_sold(id):
    """Mark listing as sold"""
    listing = Listing.query.get_or_404(id)

    if listing.seller_id != current_user.id:
        abort(403)

    listing.status = 'sold'
    listing.sold_at = datetime.utcnow()
    db.session.commit()

    flash('Listing marked as sold!', 'success')
    return redirect(url_for('dashboard'))


# =============================================================================
# MESSAGING
# =============================================================================

@app.route('/messages')
@login_required
def messages():
    """Message inbox"""
    # Get unique conversations
    sent_threads = db.session.query(Message.thread_id).filter_by(sender_id=current_user.id)
    received_threads = db.session.query(Message.thread_id).filter_by(recipient_id=current_user.id)

    all_threads = sent_threads.union(received_threads).distinct().all()

    conversations = []
    for thread_id, in all_threads:
        # Get latest message in thread
        latest = Message.query.filter_by(thread_id=thread_id).order_by(
            Message.created_at.desc()
        ).first()

        if latest:
            # Get the other user
            other_user_id = latest.recipient_id if latest.sender_id == current_user.id else latest.sender_id
            other_user = User.query.get(other_user_id)

            # Count unread
            unread = Message.query.filter_by(
                thread_id=thread_id,
                recipient_id=current_user.id,
                is_read=False
            ).count()

            conversations.append({
                'thread_id': thread_id,
                'other_user': other_user,
                'listing': latest.listing,
                'latest_message': latest,
                'unread': unread
            })

    # Sort by latest message
    conversations.sort(key=lambda x: x['latest_message'].created_at, reverse=True)

    return render_template('messages/inbox.html', conversations=conversations)


@app.route('/messages/<thread_id>')
@login_required
def message_thread(thread_id):
    """View message thread"""
    messages = Message.query.filter_by(thread_id=thread_id).filter(
        db.or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    ).order_by(Message.created_at.asc()).all()

    if not messages:
        abort(404)

    # Mark as read
    for msg in messages:
        if msg.recipient_id == current_user.id and not msg.is_read:
            msg.mark_as_read()
    db.session.commit()

    # Get the other user
    first_msg = messages[0]
    other_user_id = first_msg.recipient_id if first_msg.sender_id == current_user.id else first_msg.sender_id
    other_user = User.query.get(other_user_id)

    return render_template('messages/thread.html',
        messages=messages,
        other_user=other_user,
        thread_id=thread_id,
        listing=first_msg.listing
    )


@app.route('/messages/send', methods=['POST'])
@login_required
def send_message():
    """Send a message"""
    recipient_id = request.form.get('recipient_id', type=int)
    listing_id = request.form.get('listing_id', type=int)
    body = request.form.get('body', '').strip()
    thread_id = request.form.get('thread_id')

    if not recipient_id or not body:
        flash('Please enter a message.', 'danger')
        return redirect(request.referrer or url_for('messages'))

    if recipient_id == current_user.id:
        flash('You cannot message yourself.', 'danger')
        return redirect(request.referrer or url_for('messages'))

    # Generate thread ID if not provided
    if not thread_id:
        thread_id = generate_thread_id(current_user.id, recipient_id, listing_id or 0)

    message = Message(
        sender_id=current_user.id,
        recipient_id=recipient_id,
        listing_id=listing_id,
        thread_id=thread_id,
        body=body
    )
    db.session.add(message)

    # Update inquiry count on listing
    if listing_id:
        listing = Listing.query.get(listing_id)
        if listing:
            listing.inquiries += 1

    db.session.commit()

    flash('Message sent!', 'success')

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'thread_id': thread_id})

    return redirect(url_for('message_thread', thread_id=thread_id))


@app.route('/contact-seller/<int:listing_id>', methods=['GET', 'POST'])
@login_required
def contact_seller(listing_id):
    """Contact seller about a listing"""
    listing = Listing.query.get_or_404(listing_id)

    if listing.seller_id == current_user.id:
        flash('This is your own listing.', 'info')
        return redirect(url_for('listing_detail', id=listing_id))

    if request.method == 'POST':
        body = request.form.get('message', '').strip()
        if body:
            thread_id = generate_thread_id(current_user.id, listing.seller_id, listing_id)
            message = Message(
                sender_id=current_user.id,
                recipient_id=listing.seller_id,
                listing_id=listing_id,
                thread_id=thread_id,
                body=body
            )
            db.session.add(message)
            listing.inquiries += 1
            db.session.commit()

            flash('Message sent to seller!', 'success')
            return redirect(url_for('message_thread', thread_id=thread_id))

    return render_template('messages/contact_seller.html', listing=listing)


# =============================================================================
# USER DASHBOARD & ACCOUNT
# =============================================================================

@app.route('/dashboard')
@login_required
def dashboard():
    """User dashboard"""
    # Get user's listings
    active_listings = current_user.listings.filter_by(status='active').order_by(Listing.created_at.desc()).all()
    sold_listings = current_user.listings.filter_by(status='sold').order_by(Listing.sold_at.desc()).all()

    # Get saved listings
    saved = current_user.saved.filter_by(status='active').all()

    # Get recent messages
    recent_messages = current_user.received_messages.order_by(
        Message.created_at.desc()
    ).limit(5).all()

    # Stats
    total_views = sum(l.views for l in active_listings)
    total_inquiries = sum(l.inquiries for l in active_listings)

    return render_template('account/dashboard.html',
        active_listings=active_listings,
        sold_listings=sold_listings,
        saved=saved,
        recent_messages=recent_messages,
        total_views=total_views,
        total_inquiries=total_inquiries
    )


@app.route('/account/settings', methods=['GET', 'POST'])
@login_required
def account_settings():
    """Account settings"""
    if request.method == 'POST':
        current_user.first_name = request.form.get('first_name', '').strip()
        current_user.last_name = request.form.get('last_name', '').strip()
        current_user.phone = request.form.get('phone', '').strip()
        current_user.location = request.form.get('location', '').strip()
        current_user.state = request.form.get('state')
        current_user.postcode = request.form.get('postcode', '').strip()
        current_user.bio = request.form.get('bio', '').strip()
        current_user.seller_type = request.form.get('seller_type', 'private')

        # Handle avatar upload
        avatar = request.files.get('avatar')
        if avatar and allowed_file(avatar.filename):
            filename = secure_filename(avatar.filename)
            unique_filename = f"avatar_{current_user.id}_{uuid.uuid4().hex}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            avatar.save(filepath)
            current_user.avatar = unique_filename

        db.session.commit()
        flash('Settings saved!', 'success')

    return render_template('account/settings.html')


@app.route('/account/notifications', methods=['GET', 'POST'])
@login_required
def notification_settings():
    """Notification preferences"""
    if request.method == 'POST':
        current_user.email_notifications = request.form.get('email_notifications') == 'on'
        current_user.sms_notifications = request.form.get('sms_notifications') == 'on'
        db.session.commit()
        flash('Notification preferences saved!', 'success')

    return render_template('account/notifications.html')


@app.route('/account/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    """Change password"""
    if request.method == 'POST':
        current = request.form.get('current_password')
        new = request.form.get('new_password')
        confirm = request.form.get('confirm_password')

        if not current_user.check_password(current):
            flash('Current password is incorrect.', 'danger')
        elif len(new) < 8:
            flash('New password must be at least 8 characters.', 'danger')
        elif new != confirm:
            flash('Passwords do not match.', 'danger')
        else:
            current_user.set_password(new)
            db.session.commit()
            flash('Password changed successfully!', 'success')
            return redirect(url_for('account_settings'))

    return render_template('account/change_password.html')


@app.route('/account/saved')
@login_required
def saved_listings():
    """View saved listings"""
    saved = current_user.saved.filter_by(status='active').all()
    return render_template('account/saved.html', listings=saved)


@app.route('/account/alerts', methods=['GET', 'POST'])
@login_required
def search_alerts():
    """Manage search alerts"""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        criteria = {
            'category': request.form.get('category'),
            'brand': request.form.get('brand'),
            'min_price': request.form.get('min_price'),
            'max_price': request.form.get('max_price'),
            'state': request.form.get('state'),
        }
        # Remove empty values
        criteria = {k: v for k, v in criteria.items() if v}

        alert = SearchAlert(
            user_id=current_user.id,
            name=name or 'New Alert',
            criteria=json.dumps(criteria),
            frequency=request.form.get('frequency', 'daily')
        )
        db.session.add(alert)
        db.session.commit()

        flash('Search alert created!', 'success')

    alerts = current_user.search_alerts.all()
    return render_template('account/alerts.html', alerts=alerts)


@app.route('/account/alerts/<int:id>/delete', methods=['POST'])
@login_required
def delete_alert(id):
    """Delete a search alert"""
    alert = SearchAlert.query.get_or_404(id)
    if alert.user_id != current_user.id:
        abort(403)

    db.session.delete(alert)
    db.session.commit()
    flash('Alert deleted.', 'info')
    return redirect(url_for('search_alerts'))


@app.route('/user/<username>')
def user_profile(username):
    """Public user profile"""
    user = User.query.filter_by(username=username).first_or_404()
    listings = user.listings.filter_by(status='active').order_by(Listing.created_at.desc()).all()
    reviews = user.reviews_received.order_by(Review.created_at.desc()).all()

    return render_template('account/public_profile.html',
        profile_user=user,
        listings=listings,
        reviews=reviews
    )


# =============================================================================
# RESEARCH & NEWS
# =============================================================================

@app.route('/research')
def research():
    """Research and news hub"""
    articles = Article.query.filter_by(status='published').order_by(
        Article.published_at.desc()
    ).limit(20).all()

    featured = Article.query.filter_by(status='published', is_featured=True).first()

    categories = ['news', 'review', 'guide', 'comparison']

    return render_template('research/index.html',
        articles=articles,
        featured=featured,
        categories=categories
    )


@app.route('/research/<slug>')
def article_detail(slug):
    """Individual article page"""
    article = Article.query.filter_by(slug=slug, status='published').first_or_404()

    # Increment views
    article.views += 1
    db.session.commit()

    # Related articles
    related = Article.query.filter(
        Article.id != article.id,
        Article.status == 'published',
        Article.category == article.category
    ).order_by(Article.published_at.desc()).limit(3).all()

    return render_template('research/article.html', article=article, related=related)


@app.route('/research/category/<category>')
def research_category(category):
    """Articles by category"""
    articles = Article.query.filter_by(
        status='published', category=category
    ).order_by(Article.published_at.desc()).all()

    return render_template('research/category.html', articles=articles, category=category)


# =============================================================================
# TOOLS
# =============================================================================

@app.route('/tools/valuation', methods=['GET', 'POST'])
def valuation_tool():
    """Robot valuation tool"""
    estimate = None

    if request.method == 'POST':
        category = request.form.get('category')
        brand = request.form.get('brand')
        year = request.form.get('year', type=int)
        condition = request.form.get('condition')

        # Simple valuation algorithm based on similar listings
        query = Listing.query.filter_by(status='active')

        if category:
            query = query.filter_by(category=category)
        if brand:
            query = query.filter_by(brand=brand)
        if condition:
            query = query.filter_by(condition=condition)

        similar = query.all()

        if similar:
            prices = [l.price for l in similar]
            estimate = {
                'low': min(prices),
                'mid': sum(prices) / len(prices),
                'high': max(prices),
                'count': len(similar)
            }

    return render_template('tools/valuation.html', estimate=estimate)


@app.route('/tools/compare')
def compare_tool():
    """Compare robots side by side"""
    listing_ids = request.args.getlist('id', type=int)
    listings = Listing.query.filter(
        Listing.id.in_(listing_ids),
        Listing.status == 'active'
    ).all() if listing_ids else []

    return render_template('tools/compare.html', listings=listings)


# =============================================================================
# ADMIN
# =============================================================================

@app.route('/admin')
@login_required
@admin_required
def admin_dashboard():
    """Admin dashboard"""
    stats = {
        'total_users': User.query.count(),
        'total_listings': Listing.query.count(),
        'active_listings': Listing.query.filter_by(status='active').count(),
        'pending_reports': Report.query.filter_by(status='pending').count(),
        'recent_users': User.query.order_by(User.created_at.desc()).limit(5).all(),
        'recent_listings': Listing.query.order_by(Listing.created_at.desc()).limit(5).all(),
    }
    return render_template('admin/dashboard.html', stats=stats)


@app.route('/admin/users')
@login_required
@admin_required
def admin_users():
    """Admin user management"""
    page = request.args.get('page', 1, type=int)
    users = User.query.order_by(User.created_at.desc()).paginate(
        page=page, per_page=50
    )
    return render_template('admin/users.html', users=users)


@app.route('/admin/listings')
@login_required
@admin_required
def admin_listings():
    """Admin listing management"""
    page = request.args.get('page', 1, type=int)
    status = request.args.get('status', 'all')

    query = Listing.query
    if status != 'all':
        query = query.filter_by(status=status)

    listings = query.order_by(Listing.created_at.desc()).paginate(
        page=page, per_page=50
    )
    return render_template('admin/listings.html', listings=listings, current_status=status)


@app.route('/admin/listing/<int:id>/status', methods=['POST'])
@login_required
@admin_required
def admin_update_listing_status(id):
    """Update listing status"""
    listing = Listing.query.get_or_404(id)
    new_status = request.form.get('status')

    if new_status in ['active', 'pending', 'rejected', 'expired']:
        listing.status = new_status
        db.session.commit()
        flash(f'Listing status updated to {new_status}.', 'success')

    return redirect(url_for('admin_listings'))


@app.route('/admin/listing/<int:id>/feature', methods=['POST'])
@login_required
@admin_required
def admin_toggle_featured(id):
    """Toggle featured status"""
    listing = Listing.query.get_or_404(id)
    listing.is_featured = not listing.is_featured
    db.session.commit()

    status = 'featured' if listing.is_featured else 'unfeatured'
    flash(f'Listing {status}.', 'success')
    return redirect(request.referrer or url_for('admin_listings'))


@app.route('/admin/reports')
@login_required
@admin_required
def admin_reports():
    """Admin reports management"""
    status = request.args.get('status', 'pending')
    reports = Report.query.filter_by(status=status).order_by(Report.created_at.desc()).all()
    return render_template('admin/reports.html', reports=reports, current_status=status)


@app.route('/admin/report/<int:id>/resolve', methods=['POST'])
@login_required
@admin_required
def resolve_report(id):
    """Resolve a report"""
    report = Report.query.get_or_404(id)
    action = request.form.get('action')
    notes = request.form.get('notes', '')

    if action == 'dismiss':
        report.status = 'dismissed'
    elif action == 'resolve':
        report.status = 'resolved'
        # Optionally take action on listing/user
        if report.listing_id and request.form.get('remove_listing'):
            listing = Listing.query.get(report.listing_id)
            if listing:
                listing.status = 'rejected'

    report.admin_notes = notes
    report.resolved_at = datetime.utcnow()
    db.session.commit()

    flash('Report resolved.', 'success')
    return redirect(url_for('admin_reports'))


@app.route('/admin/articles')
@login_required
@admin_required
def admin_articles():
    """Admin article management"""
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return render_template('admin/articles.html', articles=articles)


@app.route('/admin/articles/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_article():
    """Create new article"""
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        category = request.form.get('category')
        status = request.form.get('status', 'draft')

        # Generate slug
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug).strip('-')

        article = Article(
            author_id=current_user.id,
            title=title,
            slug=slug,
            excerpt=request.form.get('excerpt', '').strip(),
            content=content,
            category=category,
            status=status
        )

        if status == 'published':
            article.published_at = datetime.utcnow()

        db.session.add(article)
        db.session.commit()

        flash('Article created!', 'success')
        return redirect(url_for('admin_articles'))

    return render_template('admin/article_form.html')


# =============================================================================
# REPORTING
# =============================================================================

@app.route('/report/listing/<int:id>', methods=['GET', 'POST'])
@login_required
def report_listing(id):
    """Report a listing"""
    listing = Listing.query.get_or_404(id)

    if request.method == 'POST':
        reason = request.form.get('reason')
        description = request.form.get('description', '').strip()

        report = Report(
            reporter_id=current_user.id,
            listing_id=id,
            reason=reason,
            description=description
        )
        db.session.add(report)
        db.session.commit()

        flash('Thank you for your report. Our team will review it.', 'success')
        return redirect(url_for('listing_detail', id=id))

    return render_template('report.html', listing=listing)


# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.errorhandler(404)
def not_found(error):
    return render_template('errors/404.html'), 404


@app.errorhandler(403)
def forbidden(error):
    return render_template('errors/403.html'), 403


@app.errorhandler(500)
def server_error(error):
    return render_template('errors/500.html'), 500


# =============================================================================
# STATIC FILES
# =============================================================================

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# =============================================================================
# CLI COMMANDS
# =============================================================================

@app.cli.command('init-db')
def init_db():
    """Initialize the database"""
    db.create_all()
    print('Database initialized!')


@app.cli.command('create-admin')
def create_admin():
    """Create an admin user"""
    email = input('Email: ').strip()
    username = input('Username: ').strip()
    password = input('Password: ').strip()

    user = User(email=email, username=username, is_admin=True, is_verified=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f'Admin user {username} created!')


@app.cli.command('seed-demo')
def seed_demo():
    """Seed demo data"""
    from seed_data import seed_database
    seed_database(db)
    print('Demo data seeded!')


# =============================================================================
# RUN
# =============================================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
