/**
 * Eraya - Find Doctors page: list, search, filter, contact & booking modals
 */
(function () {
    'use strict';

    var doctors = [
        {
            id: 1,
            name: 'Dr. Priya Sharma',
            specialty: 'Gynecologist',
            rating: 4.9,
            experience: '12 years',
            location: 'Apollo Hospital, Chennai',
            fee: '₹800',
            available: true,
            phone: '+91 98765 43210',
            email: 'priya.sharma@example.com'
        },
        {
            id: 2,
            name: 'Dr. Anitha Reddy',
            specialty: 'Endocrinologist',
            rating: 4.8,
            experience: '8 years',
            location: 'Fortis Hospital, Bangalore',
            fee: '₹1,000',
            available: true,
            phone: '+91 98765 43211',
            email: 'anitha.reddy@example.com'
        },
        {
            id: 3,
            name: 'Dr. Meera Krishnan',
            specialty: 'Nutritionist',
            rating: 4.7,
            experience: '6 years',
            location: 'Health First Clinic, Chennai',
            fee: '₹600',
            available: false,
            phone: '+91 98765 43212',
            email: 'meera.k@example.com'
        },
        {
            id: 4,
            name: 'Dr. Kavitha Venkat',
            specialty: 'Gynecologist',
            rating: 4.9,
            experience: '15 years',
            location: 'MIOT International, Chennai',
            fee: '₹1,200',
            available: true,
            phone: '+91 98765 43213',
            email: 'kavitha.v@example.com'
        },
        {
            id: 5,
            name: 'Dr. Sonali Desai',
            specialty: 'PCOS Specialist',
            rating: 4.8,
            experience: '10 years',
            location: 'Lilavati Hospital, Mumbai',
            fee: '₹900',
            available: true,
            phone: '+91 98765 43214',
            email: 'sonali.d@example.com'
        },
        {
            id: 6,
            name: 'Dr. Rekha Nair',
            specialty: 'Therapist',
            rating: 4.6,
            experience: '7 years',
            location: 'Mind Wellness Center, Kochi',
            fee: '₹750',
            available: true,
            phone: '+91 98765 43215',
            email: 'rekha.n@example.com'
        }
    ];

    var currentFilter = 'all';

    function renderDoctorCard(d) {
        var badge = d.available
            ? '<span class="available-badge">Available</span>'
            : '<span class="unavailable-badge">Unavailable</span>';
        return (
            '<div class="doctor-card" data-id="' + d.id + '">' +
            '  <div class="doctor-header">' +
            '    <div class="doctor-avatar">' + (d.name.charAt(0)) + '</div>' +
            '    <div class="doctor-basic-info">' +
            '      <h3>' + d.name + '</h3>' +
            '      <div class="doctor-specialty">' + d.specialty + '</div>' +
            '      <div class="rating"><span class="stars">★★★★★</span> ' + d.rating + '</div>' +
            '      ' + badge +
            '    </div>' +
            '  </div>' +
            '  <div class="doctor-details">' +
            '    <div class="detail-row"><span class="detail-icon">📍</span> ' + d.location + '</div>' +
            '    <div class="detail-row"><span class="detail-icon">⏱</span> ' + d.experience + ' experience</div>' +
            '    <div class="detail-row"><span class="detail-icon">💰</span> Consultation: ' + d.fee + '</div>' +
            '  </div>' +
            '  <div class="doctor-actions">' +
            '    <button class="contact-btn" onclick="window.openContactModal(' + d.id + ')">Contact</button>' +
            '    <button class="book-btn" onclick="window.openBookingModal(' + d.id + ')" ' + (d.available ? '' : 'disabled') + '>Book</button>' +
            '  </div>' +
            '</div>'
        );
    }

    function filterList() {
        var list = doctors;
        if (currentFilter !== 'all') {
            list = doctors.filter(function (d) {
                return d.specialty.toLowerCase().indexOf(currentFilter) !== -1 ||
                    (currentFilter === 'pcos' && d.specialty.toLowerCase().indexOf('pcos') !== -1);
            });
        }
        return list;
    }

    function renderGrid() {
        var grid = document.getElementById('doctorsGrid');
        if (!grid) return;
        var list = filterList();
        grid.innerHTML = list.map(renderDoctorCard).join('');
    }

    function searchDoctors() {
        var input = document.getElementById('searchInput');
        var q = (input && input.value) ? input.value.trim().toLowerCase() : '';
        var list = filterList();
        if (q) {
            list = list.filter(function (d) {
                return d.name.toLowerCase().indexOf(q) !== -1 ||
                    d.specialty.toLowerCase().indexOf(q) !== -1 ||
                    (d.location && d.location.toLowerCase().indexOf(q) !== -1);
            });
        }
        var grid = document.getElementById('doctorsGrid');
        if (grid) grid.innerHTML = list.map(renderDoctorCard).join('');
    }

    function filterDoctors(specialty, el) {
        currentFilter = specialty;
        var chips = document.querySelectorAll('.filter-chip');
        chips.forEach(function (c) { c.classList.remove('active'); });
        if (el) el.classList.add('active');
        renderGrid();
    }

    function getDoctor(id) {
        return doctors.filter(function (d) { return d.id === id; })[0] || null;
    }

    function openContactModal(id) {
        var d = getDoctor(id);
        if (!d) return;
        var html =
            '<div class="modal-overlay" id="contactModal">' +
            '  <div class="modal-content">' +
            '    <button class="modal-close" onclick="window.closeContactModal()">&times;</button>' +
            '    <h2>Contact ' + d.name + '</h2>' +
            '    <div class="contact-details">' +
            '      <div class="contact-detail-item"><span class="detail-label">Phone</span><a href="tel:' + d.phone + '" class="detail-value">' + d.phone + '</a></div>' +
            '      <div class="contact-detail-item"><span class="detail-label">Email</span><a href="mailto:' + d.email + '" class="detail-value">' + d.email + '</a></div>' +
            '    </div>' +
            '    <div class="modal-actions">' +
            '      <a href="tel:' + d.phone + '" class="modal-btn call-btn">Call</a>' +
            '      <a href="mailto:' + d.email + '" class="modal-btn email-btn">Email</a>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap.firstElementChild);
    }

    function closeContactModal() {
        var m = document.getElementById('contactModal');
        if (m) m.remove();
    }

    function openBookingModal(id) {
        var d = getDoctor(id);
        if (!d) return;
        var html =
            '<div class="modal-overlay" id="bookingModal">' +
            '  <div class="modal-content">' +
            '    <button class="modal-close" onclick="window.closeBookingModal()">&times;</button>' +
            '    <h2>Book appointment</h2>' +
            '    <p style="margin-bottom:16px;">' + d.name + ' – ' + d.specialty + '</p>' +
            '    <div class="booking-summary">' +
            '      <div class="summary-row"><span>Consultation fee</span><span class="fee">' + d.fee + '</span></div>' +
            '    </div>' +
            '    <div class="form-group"><label>Preferred date</label><input type="date" id="bookDate"></div>' +
            '    <div class="form-group"><label>Preferred time</label><select id="bookTime"><option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option></select></div>' +
            '    <div class="form-group"><label>Reason for visit</label><textarea id="bookReason" placeholder="Brief reason for visit"></textarea></div>' +
            '    <div class="modal-actions">' +
            '      <button class="modal-btn cancel-btn" onclick="window.closeBookingModal()">Cancel</button>' +
            '      <button class="modal-btn confirm-btn" onclick="window.submitBooking(' + id + ')">Confirm</button>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap.firstElementChild);
    }

    function closeBookingModal() {
        var m = document.getElementById('bookingModal');
        if (m) m.remove();
    }

    function submitBooking(id) {
        var d = getDoctor(id);
        var date = document.getElementById('bookDate');
        var time = document.getElementById('bookTime');
        var reason = document.getElementById('bookReason');
        if (!d) return;
        if (date && !date.value) {
            alert('Please select a date.');
            return;
        }
        alert('Booking request sent to ' + d.name + ' for ' + (date ? date.value : '') + ' at ' + (time ? time.value : '') + '. You will be contacted to confirm.');
        closeBookingModal();
    }

    function callEmergency() {
        if (confirm('Call emergency services (e.g. 112 / 108)?')) {
            window.location.href = 'tel:112';
        }
    }

    window.searchDoctors = searchDoctors;
    window.filterDoctors = filterDoctors;
    window.openContactModal = openContactModal;
    window.closeContactModal = closeContactModal;
    window.openBookingModal = openBookingModal;
    window.closeBookingModal = closeBookingModal;
    window.submitBooking = submitBooking;
    window.callEmergency = callEmergency;

    document.addEventListener('DOMContentLoaded', renderGrid);
})();
