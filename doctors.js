// Doctors data with contact information
const doctorsData = [
    {
        id: 1,
        name: "Dr. Priya Sharma",
        specialty: "gynecologist",
        avatar: "👩‍⚕️",
        rating: 4.9,
        reviews: 150,
        experience: 15,
        location: "Kātpādi, Tamil Nadu",
        hospital: "Apollo Hospital",
        phone: "+91 98765 43210",
        email: "priya.sharma@apollo.com",
        available: true,
        consultationFee: "₹800"
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        specialty: "endocrinologist",
        avatar: "👨‍⚕️",
        rating: 4.8,
        reviews: 120,
        experience: 12,
        location: "Vellore, Tamil Nadu",
        hospital: "CMC Vellore",
        phone: "+91 98765 43211",
        email: "rajesh.kumar@cmc.com",
        available: true,
        consultationFee: "₹1000"
    },
    {
        id: 3,
        name: "Dr. Meera Patel",
        specialty: "pcos",
        avatar: "👩‍⚕️",
        rating: 5.0,
        reviews: 200,
        experience: 18,
        location: "Kātpādi, Tamil Nadu",
        hospital: "Fortis Hospital",
        phone: "+91 98765 43212",
        email: "meera.patel@fortis.com",
        available: true,
        consultationFee: "₹1200"
    },
    {
        id: 4,
        name: "Dr. Ananya Reddy",
        specialty: "nutritionist",
        avatar: "👩‍⚕️",
        rating: 4.7,
        reviews: 95,
        experience: 10,
        location: "Vellore, Tamil Nadu",
        hospital: "Wellness Clinic",
        phone: "+91 98765 43213",
        email: "ananya.reddy@wellness.com",
        available: false,
        consultationFee: "₹600"
    },
    {
        id: 5,
        name: "Dr. Arun Verma",
        specialty: "therapist",
        avatar: "👨‍⚕️",
        rating: 4.6,
        reviews: 85,
        experience: 8,
        location: "Kātpādi, Tamil Nadu",
        hospital: "Mind Care Center",
        phone: "+91 98765 43214",
        email: "arun.verma@mindcare.com",
        available: true,
        consultationFee: "₹700"
    },
    {
        id: 6,
        name: "Dr. Lakshmi Nair",
        specialty: "gynecologist",
        avatar: "👩‍⚕️",
        rating: 4.9,
        reviews: 165,
        experience: 20,
        location: "Vellore, Tamil Nadu",
        hospital: "Apollo Speciality",
        phone: "+91 98765 43215",
        email: "lakshmi.nair@apollo.com",
        available: true,
        consultationFee: "₹900"
    }
];

let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayDoctors(doctorsData);
});

// Display doctors
function displayDoctors(doctors) {
    const grid = document.getElementById('doctorsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        grid.appendChild(card);
    });
}

// Create doctor card
function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.setAttribute('data-specialty', doctor.specialty);

    const stars = '⭐'.repeat(Math.floor(doctor.rating));
    const availableBadge = doctor.available ?
        '<span class="available-badge">Available Today</span>' :
        '<span class="unavailable-badge">Not Available</span>';

    card.innerHTML = `
        <div class="doctor-header">
            <div class="doctor-avatar">${doctor.avatar}</div>
            <div class="doctor-basic-info">
                <h3>${doctor.name}</h3>
                <div class="doctor-specialty">${capitalizeSpecialty(doctor.specialty)}</div>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                </div>
                ${availableBadge}
            </div>
        </div>
        <div class="doctor-details">
            <div class="detail-row">
                <span class="detail-icon">📍</span>
                <span>${doctor.location}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">💼</span>
                <span>${doctor.experience} years experience</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🏥</span>
                <span>${doctor.hospital}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">💰</span>
                <span>Consultation: ${doctor.consultationFee}</span>
            </div>
        </div>
        <div class="doctor-actions">
            <button class="contact-btn" onclick="contactDoctor(${doctor.id})">
                📞 Contact
            </button>
            <button class="book-btn" onclick="bookAppointment(${doctor.id})">
                Book Appointment
            </button>
        </div>
    `;

    return card;
}

// Capitalize specialty
function capitalizeSpecialty(specialty) {
    const specialtyMap = {
        'gynecologist': 'Gynecologist',
        'endocrinologist': 'Endocrinologist',
        'nutritionist': 'Nutritionist',
        'therapist': 'Therapist',
        'pcos': 'PCOS Specialist'
    };
    return specialtyMap[specialty] || specialty;
}

// Filter doctors
function filterDoctors(specialty, element) {
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    element.classList.add('active');

    currentFilter = specialty;

    // Filter and display
    if (specialty === 'all') {
        displayDoctors(doctorsData);
    } else {
        const filtered = doctorsData.filter(doc => doc.specialty === specialty);
        displayDoctors(filtered);
    }
}

// Search doctors
function searchDoctors() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = (searchInput && searchInput.value) ? searchInput.value.toLowerCase() : '';

    const filtered = doctorsData.filter(doctor => {
        return doctor.name.toLowerCase().includes(searchTerm) ||
               doctor.specialty.toLowerCase().includes(searchTerm) ||
               doctor.location.toLowerCase().includes(searchTerm) ||
               doctor.hospital.toLowerCase().includes(searchTerm);
    });

    displayDoctors(filtered);
}

// Contact doctor
function contactDoctor(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (!doctor) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content contact-modal">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            <h2>Contact ${doctor.name}</h2>
            <div class="contact-details">
                <div class="contact-detail-item">
                    <span class="detail-label">📱 Phone:</span>
                    <a href="tel:${doctor.phone}" class="detail-value">${doctor.phone}</a>
                </div>
                <div class="contact-detail-item">
                    <span class="detail-label">📧 Email:</span>
                    <a href="mailto:${doctor.email}" class="detail-value">${doctor.email}</a>
                </div>
                <div class="contact-detail-item">
                    <span class="detail-label">🏥 Hospital:</span>
                    <span class="detail-value">${doctor.hospital}</span>
                </div>
                <div class="contact-detail-item">
                    <span class="detail-label">📍 Location:</span>
                    <span class="detail-value">${doctor.location}</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn call-btn" onclick="window.location.href='tel:${doctor.phone}'">
                    📞 Call Now
                </button>
                <button class="modal-btn email-btn" onclick="window.location.href='mailto:${doctor.email}'">
                    📧 Send Email
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Book appointment
function bookAppointment(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (!doctor) return;

    if (!doctor.available) {
        alert('Sorry, this doctor is not available today. Please try another day or contact them directly.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content booking-modal">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            <h2>Book Appointment with ${doctor.name}</h2>
            <form onsubmit="submitBooking(event, ${doctorId})">
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" name="patient_name" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="patient_phone" required placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label>Preferred Date</label>
                    <input type="date" name="preferred_date" required min="${getTodayDate()}">
                </div>
                <div class="form-group">
                    <label>Preferred Time</label>
                    <select name="preferred_time" required>
                        <option value="">Select time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reason for Visit (Optional)</label>
                    <textarea name="reason" placeholder="Brief description of your concerns"></textarea>
                </div>
                <div class="booking-summary">
                    <div class="summary-row">
                        <span>Consultation Fee:</span>
                        <span class="fee">${doctor.consultationFee}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="modal-btn cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button type="submit" class="modal-btn confirm-btn">Confirm Booking</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Submit booking (sends to server when logged in)
function submitBooking(event, doctorId) {
    event.preventDefault();
    const doctor = doctorsData.find(d => d.id === doctorId);
    if (!doctor) return;

    const form = event.target;
    const payload = {
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        preferred_date: form.elements['preferred_date'].value,
        preferred_time: form.elements['preferred_time'].value,
        patient_name: form.elements['patient_name'].value,
        patient_phone: form.elements['patient_phone'].value,
        reason: (form.elements['reason'] && form.elements['reason'].value) || ''
    };

    const opts = { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
    fetch('/api/appointments', opts)
        .then(function(r) {
            if (r.status === 401) {
                if (confirm('Please sign in to book an appointment. Go to login?')) {
                    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.href);
                }
                return null;
            }
            return r.json();
        })
        .then(function(data) {
            if (!data) return;
            const overlay = event.target.closest('.modal-overlay');
            if (overlay) overlay.remove();
            if (data.error) {
                alert(data.error);
            } else {
                alert('Appointment requested successfully with ' + doctor.name + '. You will be contacted to confirm.');
            }
        })
        .catch(function() {
            alert('Could not save appointment. Check your connection and try again.');
        });
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Call emergency
function callEmergency() {
    if (confirm('This will call emergency services. Do you want to proceed?')) {
        window.location.href = 'tel:112';
    }
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDoctors();
            }
        });
    }
});
