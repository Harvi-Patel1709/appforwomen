/**
 * Eraya Dashboard - Calendar and UI scripts
 */
(function () {
    'use strict';

    function renderCalendar() {
        var container = document.getElementById('calendarDays');
        if (!container) return;

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startPadding = firstDay.getDay();
        var daysInMonth = lastDay.getDate();

        var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var header = container.closest('.calendar-section').querySelector('.calendar-header h3');
        if (header) {
            header.textContent = firstDay.toLocaleString('default', { month: 'long' }) + ' ' + year;
        }

        container.innerHTML = '';

        for (var i = 0; i < startPadding; i++) {
            var empty = document.createElement('div');
            empty.className = 'calendar-day other-month';
            empty.textContent = '';
            container.appendChild(empty);
        }

        var today = now.getDate();
        for (var d = 1; d <= daysInMonth; d++) {
            var cell = document.createElement('div');
            cell.className = 'calendar-day' + (d === today ? ' selected' : '');
            cell.textContent = d;
            cell.setAttribute('data-date', year + '-' + (month + 1) + '-' + d);
            container.appendChild(cell);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCalendar);
    } else {
        renderCalendar();
    }
})();
