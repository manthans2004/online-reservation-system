document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements with null checks
  const form = document.getElementById('reservationForm');
  const confirmation = document.getElementById('confirmation');
  const currentMonthEl = document.getElementById('currentMonth');
  const calendarEl = document.getElementById('calendar');
  const timeSlotEl = document.getElementById('timeSlot');
  const trainSelectEl = document.getElementById('trainNumber');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const submitBtn = form ? form.querySelector('.submit-btn') : null;

  // Exit if essential elements are missing
  if (!form || !confirmation || !currentMonthEl || !calendarEl || !timeSlotEl || !trainSelectEl || !submitBtn) {
    console.error('Critical elements missing from DOM');
    return;
  }

  // State variables
  let currentDate = new Date();
  let selectedDate = null;
  let isProcessing = false;

  // Initialize calendar
  renderCalendar(currentDate);

  // Event listeners with null checks
  if (prevMonthBtn) prevMonthBtn.addEventListener('click', goToPreviousMonth);
  if (nextMonthBtn) nextMonthBtn.addEventListener('click', goToNextMonth);
  if (trainSelectEl) trainSelectEl.addEventListener('change', handleTrainChange);
  if (form) form.addEventListener('submit', handleFormSubmit);

  function goToPreviousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  }

  function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  }

  function handleTrainChange() {
    if (selectedDate) {
      updateTimeSlots(this.value, selectedDate);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isProcessing) return;

    try {
      // Get form values with null checks
      const formData = {
        name: getValue('name'),
        email: getValue('email'),
        phone: getValue('phone'),
        trainNumber: getValue('trainNumber'),
        coachType: getValue('coachType'),
        fromStation: getValue('fromStation'),
        toStation: getValue('toStation'),
        date: selectedDate,
        time: getValue('timeSlot'),
        berth: getValue('berth'),
        notes: getValue('notes')
      };

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.trainNumber || !formData.coachType || 
          !formData.fromStation || !formData.toStation || 
          !formData.date || !formData.time) {
        throw new Error('Please fill all required fields');
      }

      // Set processing state
      isProcessing = true;
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock PNR
      const pnr = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Show confirmation
      showConfirmation(formData, pnr);
      
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    } finally {
      // Reset processing state
      isProcessing = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Book Ticket';
      }
    }
  }

  function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function renderCalendar(date) {
    if (!currentMonthEl || !calendarEl) return;

    currentMonthEl.textContent = formatMonthYear(date);
    calendarEl.innerHTML = '';

    // Day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day header';
      dayEl.textContent = day;
      calendarEl.appendChild(dayEl);
    });

    // Get first and last day of month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startingDay = firstDay.getDay();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Empty cells for days before first day
    for (let i = 0; i < startingDay; i++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'calendar-day empty';
      calendarEl.appendChild(emptyEl);
    }

    // Days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day available';
      dayEl.textContent = i;

      const currentDay = new Date(date.getFullYear(), date.getMonth(), i);
      dayEl.addEventListener('click', () => {
        // Remove selection from all days
        document.querySelectorAll('.calendar-day').forEach(day => {
          day.classList.remove('selected');
        });
        
        // Add to clicked day
        dayEl.classList.add('selected');
        selectedDate = currentDay;
        
        // Update time slots if train is selected
        if (trainSelectEl && trainSelectEl.value) {
          updateTimeSlots(trainSelectEl.value, currentDay);
        }
      });

      calendarEl.appendChild(dayEl);
    }
  }

  function updateTimeSlots(trainNumber, date) {
    if (!timeSlotEl) return;

    // Mock data
    const mockTimes = {
      '12001': ['06:00 AM', '12:30 PM', '07:00 PM'],
      '12951': ['07:15 AM', '02:45 PM', '10:30 PM'],
      '12627': ['05:30 AM', '01:15 PM', '08:45 PM']
    };

    timeSlotEl.innerHTML = '<option value="">Select time</option>';
    const times = mockTimes[trainNumber] || ['10:00 AM', '04:00 PM'];
    
    times.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      timeSlotEl.appendChild(option);
    });
  }

  function showConfirmation(formData, pnr) {
    // Safe element setting
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText('confirmName', formData.name);
    setText('confirmEmail', formData.email);
    setText('confirmTrain', `${formData.trainNumber} (${formData.coachType})`);
    setText('confirmFromStation', formData.fromStation);
    setText('confirmToStation', formData.toStation);
    setText('confirmDate', formatDate(formData.date));
    setText('confirmTime', formData.time);
    setText('confirmBerth', formData.berth || 'Auto-assigned');
    setText('confirmRef', pnr);

    if (form) form.style.display = 'none';
    if (confirmation) confirmation.style.display = 'block';
  }

  function formatMonthYear(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
});