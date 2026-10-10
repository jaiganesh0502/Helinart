import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ShieldCheck, 
  AlertCircle, Phone, Sparkles, X, RefreshCw, MessageSquare, Download, AlertTriangle 
} from 'lucide-react';
import { getServices, getSlotAvailability, bookSlot, cancelBooking, rescheduleBooking } from '../../api';
import { useStore } from '../../store/useStore';
import StudioPortfolio from '../../components/StudioPortfolio';
import SEO from '../../components/SEO';

export default function StudioBooking() {
  const { user, addToast } = useStore();

  // Booking Flow State
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('gel-manicure');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Client Details & Policy
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [clientNotes, setClientNotes] = useState('');
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Completed Booking State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Reschedule Modal State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [reschedulingLoading, setReschedulingLoading] = useState(false);

  // Generate next 7 dates
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-IN', { day: 'numeric' });
    const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
    return { dateStr, dayName, dayNum, monthName };
  });

  // Load initial services & set default date
  useEffect(() => {
    getServices().then(res => {
      setServices(res);
      if (res.length > 0) setSelectedServiceId(res[0].id);
    });
    const defaultDate = next7Days[0].dateStr;
    setSelectedDate(defaultDate);
  }, []);

  // Fetch slot availability when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    let mounted = true;
    setLoadingSlots(true);
    getSlotAvailability(selectedDate)
      .then(res => {
        if (mounted) {
          setSlots(res);
          // Preselect first available slot if previous is unavailable
          const firstAvail = res.find(s => s.isAvailable);
          setSelectedTime(firstAvail ? firstAvail.time : '');
        }
      })
      .finally(() => {
        if (mounted) setLoadingSlots(false);
      });
    return () => { mounted = false; };
  }, [selectedDate]);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
  const advanceDeposit = 200;
  const balanceDue = selectedService ? Math.max(0, selectedService.price - advanceDeposit) : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      addToast('Please enter your full name and phone number.', 'error');
      return;
    }
    if (!/^\d{10}$/.test(clientPhone.replace(/\D/g, ''))) {
      addToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!selectedTime) {
      addToast('Please select an available time slot.', 'error');
      return;
    }
    if (!policyAgreed) {
      addToast('Please agree to the cancellation and late policy.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookSlot({
        date: selectedDate,
        time: selectedTime,
        serviceId: selectedServiceId,
        userName: clientName.trim(),
        phone: clientPhone.trim()
      });
      setConfirmedBooking(booking);
      addToast(`Appointment confirmed! Reference: ${booking.id} ✨`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      addToast(err.message || 'Could not book slot. Please try another time.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate & Download real .ics Calendar File
  const handleDownloadICS = (booking) => {
    try {
      const [hoursStr, minutesPart] = booking.time.split(':');
      const [minutesStr, ampm] = minutesPart.split(' ');
      let hours = parseInt(hoursStr, 10);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const dateParts = booking.date.split('-');
      const startDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), hours, parseInt(minutesStr, 10));
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      const pad = (n) => (n < 10 ? '0' + n : n);
      const toICSDate = (d) => {
        return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
      };

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nailsbyhelina//Studio Appointment//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${booking.id}@nailsbyhelina.com`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${toICSDate(startDate)}`,
        `DTEND:${toICSDate(endDate)}`,
        `SUMMARY:${booking.serviceName} at Nailsbyhelina Studio`,
        `DESCRIPTION:Appointment for ${booking.userName}. Booking Ref: ${booking.id}. Please arrive 5 minutes early. Remaining balance of ₹${balanceDue} payable at studio.`,
        'LOCATION:Nailsbyhelina Private Studio (Location details shared upon confirmation)',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${booking.id}-nailsbyhelina.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast('Calendar invite (.ics) downloaded! 📅', 'success');
    } catch (err) {
      console.error(err);
      addToast('Could not generate calendar file.', 'error');
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? As per policy, advance deposits within 24 hours are non-refundable.')) {
      return;
    }
    try {
      await cancelBooking(bookingId);
      setConfirmedBooking(prev => ({ ...prev, status: 'Cancelled' }));
      addToast('Appointment cancelled successfully.', 'info');
    } catch (err) {
      addToast('Failed to cancel appointment.', 'error');
    }
  };

  // Open Reschedule Modal
  const handleOpenReschedule = () => {
    setRescheduleDate(next7Days[1]?.dateStr || next7Days[0].dateStr);
    setIsRescheduling(true);
  };

  // Load slots for reschedule date
  useEffect(() => {
    if (!rescheduleDate || !isRescheduling) return;
    getSlotAvailability(rescheduleDate).then(res => {
      setRescheduleSlots(res);
      const firstAvail = res.find(s => s.isAvailable);
      setRescheduleTime(firstAvail ? firstAvail.time : '');
    });
  }, [rescheduleDate, isRescheduling]);

  // Submit Reschedule
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleTime) {
      addToast('Please select a new time slot.', 'error');
      return;
    }
    setReschedulingLoading(true);
    try {
      const updated = await rescheduleBooking({
        bookingId: confirmedBooking.id,
        newDate: rescheduleDate,
        newTime: rescheduleTime
      });
      setConfirmedBooking(updated);
      setIsRescheduling(false);
      addToast('Appointment successfully rescheduled! ✨', 'success');
    } catch (err) {
      addToast(err.message || 'Could not reschedule slot.', 'error');
    } finally {
      setReschedulingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      <SEO
        title="Book Studio Appointment | Nailsbyhelina"
        description="Reserve your private appointment at Nailsbyhelina Studio. Gel manicures, custom nail art, BIAB overlays, and sculpted extensions with master artists."
        keywords="book nail appointment, luxury nail studio, gel manicure booking, nailsbyhelina appointments"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Luxury Nail Art & Sculpting Studio",
          "provider": {
            "@type": "NailSalon",
            "name": "Nailsbyhelina Studio"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": "400",
            "highPrice": "2200"
          }
        }}
      />
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <CalendarIcon className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Private Studio Atelier</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Book a Studio Appointment
        </h1>
        <p className="text-sm sm:text-base text-[#786866] leading-relaxed">
          Reserve a private, one-on-one session with our master nail sculptors. Experience Russian dry cuticle care, bespoke velvet chrome, and custom-sculpted extensions.
        </p>
      </div>

      {/* CONFIRMED BOOKING SCREEN */}
      {confirmedBooking ? (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-8 animate-in fade-in duration-300">
          
          <div className="text-center space-y-2 border-b border-[#D8C6C3]/60 pb-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
              confirmedBooking.status === 'Cancelled' ? 'bg-[#FBEBEA] text-[#9C5550]' : 'bg-[#EEF3EE] text-[#879B83]'
            }`}>
              {confirmedBooking.status === 'Cancelled' ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C5550]">
              {confirmedBooking.status === 'Cancelled' ? 'Appointment Cancelled' : 'Slot Reserved'}
            </span>
            <h2 className="font-heading font-medium text-3xl text-[#313851]">
              Booking Reference #{confirmedBooking.id}
            </h2>
            <p className="text-xs text-[#786866]">
              A confirmation reminder has been logged for <strong>{confirmedBooking.userName}</strong>.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#786866] block">Service:</span>
              <strong className="text-sm text-[#313851] font-heading">{confirmedBooking.serviceName}</strong>
            </div>
            <div>
              <span className="text-[#786866] block">Date & Time:</span>
              <strong className="text-sm text-[#313851] font-heading">{confirmedBooking.date} at {confirmedBooking.time}</strong>
            </div>
            <div>
              <span className="text-[#786866] block">Deposit Paid / Balance:</span>
              <strong className="text-sm text-[#313851] font-heading">₹{advanceDeposit} paid • ₹{balanceDue} at studio</strong>
            </div>
          </div>

          {/* SIMULATED WHATSAPP / SMS REMINDER MESSAGE PREVIEW */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#313851]">
              <MessageSquare className="w-4 h-4 text-[#879B83]" />
              <span>Simulated WhatsApp Reminder Preview</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#E7F3E6] border border-[#B7DCB2] text-xs text-[#2B3B29] space-y-2 shadow-2xs font-sans">
              <div className="flex items-center justify-between text-[11px] text-[#557750] border-b border-[#B7DCB2]/60 pb-1.5 font-medium">
                <span>Nailsbyhelina Atelier Verified Concierge</span>
                <span>Just now</span>
              </div>
              <p className="leading-relaxed">
                "Hi <strong>{confirmedBooking.userName}</strong>! Your appointment at Nailsbyhelina Studio is confirmed for <strong>{confirmedBooking.date}</strong> at <strong>{confirmedBooking.time}</strong> for <strong>{confirmedBooking.serviceName}</strong>.
              </p>
              <p className="leading-relaxed text-[#43623E]">
                📍 Studio Location: Private Studio Atelier (Location details provided upon confirmation). <br />
                💰 Advance deposit of ₹200 received. Balance ₹{balanceDue} payable upon completion. Please arrive 5 minutes early. See you soon!"
              </p>
            </div>
          </div>

          {/* Action Buttons: Add to Calendar, Reschedule, Cancel */}
          {confirmedBooking.status !== 'Cancelled' && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleDownloadICS(confirmedBooking)}
                className="flex-1 py-3 px-4 rounded-full font-semibold text-xs text-[#FFFDFC] bg-[#313851] hover:bg-[#262D42] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={handleOpenReschedule}
                className="flex-1 py-3 px-4 rounded-full font-semibold text-xs text-[#313851] bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reschedule Slot</span>
              </button>

              <button
                onClick={() => handleCancelBooking(confirmedBooking.id)}
                className="py-3 px-5 rounded-full font-semibold text-xs text-[#793D39] hover:bg-[#FBEBEA] transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          )}

          {/* RESCHEDULE MODAL */}
          {isRescheduling && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262D42]/60 backdrop-blur-sm">
              <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#D8C6C3] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
                  <h3 className="font-heading font-medium text-xl text-[#313851]">
                    Reschedule Your Slot
                  </h3>
                  <button onClick={() => setIsRescheduling(false)} className="text-[#786866] hover:text-[#313851]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#313851] mb-2">Select New Date</label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {next7Days.map(d => (
                        <button
                          key={d.dateStr}
                          type="button"
                          onClick={() => setRescheduleDate(d.dateStr)}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            rescheduleDate === d.dateStr
                              ? 'bg-[#9C5550] text-[#FFFDFC] border-[#9C5550]'
                              : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3]'
                          }`}
                        >
                          <span className="block text-[10px]">{d.dayName}</span>
                          <span className="block font-bold text-xs">{d.dayNum}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#313851] mb-2">Select Available Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {rescheduleSlots.map(s => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.isAvailable}
                          onClick={() => setRescheduleTime(s.time)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            !s.isAvailable
                              ? 'opacity-40 bg-gray-100 line-through cursor-not-allowed'
                              : (rescheduleTime === s.time
                                  ? 'bg-[#313851] text-[#FFFDFC] border-[#313851]'
                                  : 'bg-[#FFFDFC] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]')
                          }`}
                        >
                          {s.time} {!s.isAvailable && '(Booked)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-4 py-2 rounded-full font-medium text-[#786866]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reschedulingLoading}
                      className="px-5 py-2 rounded-full font-semibold bg-[#9C5550] text-[#FFFDFC]"
                    >
                      {reschedulingLoading ? 'Updating...' : 'Confirm Reschedule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-xs text-[#9C5550] font-semibold underline hover:text-[#8A4743]"
            >
              Book Another Studio Appointment
            </button>
          </div>

        </div>
      ) : (
        /* MAIN BOOKING FORM GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: 4 Step Interactive Booking Form */}
          <form onSubmit={handleBookingSubmit} className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: Service Selection */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
                <h2 className="font-heading font-medium text-xl text-[#313851] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs flex items-center justify-center font-bold">1</span>
                  <span>Select Studio Service</span>
                </h2>
                <span className="text-xs text-[#786866]">All appointments include dry prep</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      selectedServiceId === svc.id
                        ? 'border-[#9C5550] bg-[#F4ECE6]/60 shadow-xs'
                        : 'border-[#D8C6C3] bg-[#FFFDFC] hover:border-[#9C5550]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-medium text-base text-[#313851]">{svc.name}</h4>
                        <span className="font-heading font-semibold text-base text-[#262D42]">₹{svc.price}</span>
                      </div>
                      <p className="text-[11.5px] text-[#786866] mt-1 line-clamp-2 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#786866] pt-2 border-t border-[#D8C6C3]/50">
                      <span>Duration: {svc.durationText}</span>
                      <span className={`font-semibold ${selectedServiceId === svc.id ? 'text-[#9C5550]' : 'text-transparent'}`}>
                        ✓ Selected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: Date Selector (Next 7 days) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-4">
              <h2 className="font-heading font-medium text-xl text-[#313851] flex items-center gap-2 border-b border-[#D8C6C3]/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs flex items-center justify-center font-bold">2</span>
                <span>Select Appointment Date</span>
              </h2>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {next7Days.map((d) => (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      selectedDate === d.dateStr
                        ? 'bg-[#9C5550] text-[#FFFDFC] border-[#9C5550] shadow-xs scale-102'
                        : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wide opacity-80">{d.dayName}</span>
                    <span className="block font-heading font-bold text-xl my-0.5">{d.dayNum}</span>
                    <span className="block text-[10px] opacity-80">{d.monthName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Time Slot Selector (With Real-Time Booked Slot Disabling) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
                <h2 className="font-heading font-medium text-xl text-[#313851] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs flex items-center justify-center font-bold">3</span>
                  <span>Select Time Slot</span>
                </h2>
                <span className="text-xs text-[#879B83] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#879B83] animate-pulse" />
                  <span>Real-time availability</span>
                </span>
              </div>

              {loadingSlots ? (
                <div className="py-6 text-center text-xs text-[#786866] animate-pulse">
                  Checking atelier schedule...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedTime(s.time)}
                      className={`py-3 px-2 rounded-2xl text-xs font-semibold border transition-all ${
                        !s.isAvailable
                          ? 'bg-[#EFEAE6] text-[#A69B99] border-[#DDD5CF] cursor-not-allowed opacity-50 line-through'
                          : (selectedTime === s.time
                              ? 'bg-[#313851] text-[#FFFDFC] border-[#313851] shadow-xs scale-102'
                              : 'bg-[#FFFDFC] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]')
                      }`}
                    >
                      <span>{s.time}</span>
                      {!s.isAvailable && (
                        <span className="block text-[10px] font-normal no-underline">Booked</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-[#786866]">
                Note: Lunch recess observed between 1:00 PM and 2:00 PM daily.
              </p>
            </div>

            {/* STEP 4: Client Info & Policy Agreement */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-5">
              <h2 className="font-heading font-medium text-xl text-[#313851] flex items-center gap-2 border-b border-[#D8C6C3]/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs flex items-center justify-center font-bold">4</span>
                <span>Client Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rhea Sen"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] mb-1">Mobile Number (for SMS & WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#313851] mb-1">Special Preferences / Reference Notes</label>
                  <input
                    type="text"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="e.g. Existing acrylic soak-off required / sensitive nail beds"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                  />
                </div>
              </div>

              {/* CANCELLATION & LATE POLICY NOTICE BOX */}
              <div className="p-4 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/50 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[#313851]">
                  <ShieldCheck className="w-4 h-4 text-[#879B83]" />
                  <span>Cancellation & Late Arrival Policy</span>
                </div>
                <ul className="list-disc list-inside text-[#453A3C] space-y-1 text-[11.5px] leading-relaxed">
                  <li><strong>Free Cancellation / Rescheduling:</strong> Permitted up to 24 hours prior to appointment time.</li>
                  <li><strong>Advance Deposit:</strong> ₹200 deposit is non-refundable if cancelled within 24 hours of appointment.</li>
                  <li><strong>Grace Period:</strong> 15-minute grace window for Bengaluru traffic; appointments may be abbreviated thereafter.</li>
                </ul>
              </div>

              {/* REQUIRED POLICY CHECKBOX */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={policyAgreed}
                  onChange={(e) => setPolicyAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#9C5550] w-4 h-4 rounded"
                />
                <span className="text-xs text-[#313851] leading-tight font-medium">
                  I agree to the cancellation, rescheduling, and 15-minute late arrival policy.
                </span>
              </label>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting || !policyAgreed}
                className="w-full py-4 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
                }}
              >
                <Sparkles className="w-4 h-4 text-[#FFFDFC]" />
                <span>
                  {submitting ? 'Confirming...' : `Confirm Studio Appointment • Pay ₹${advanceDeposit} Deposit`}
                </span>
              </button>
            </div>

          </form>

          {/* RIGHT COLUMN: Financial Summary & Studio Info Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Advance Deposit & Financial Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-4">
              <h3 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
                Appointment Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#453A3C]">
                  <span>Selected Service:</span>
                  <strong className="text-[#313851] font-semibold">{selectedService?.name}</strong>
                </div>

                <div className="flex justify-between text-[#453A3C]">
                  <span>Date & Time:</span>
                  <span className="font-semibold text-[#313851]">{selectedDate} at {selectedTime || 'Pending'}</span>
                </div>

                <div className="flex justify-between text-[#453A3C]">
                  <span>Service Duration:</span>
                  <span>{selectedService?.durationText}</span>
                </div>

                <div className="flex justify-between text-[#453A3C] pt-2 border-t border-[#D8C6C3]/60">
                  <span>Total Service Fee:</span>
                  <span className="font-semibold text-[#313851]">₹{selectedService?.price}</span>
                </div>

                <div className="flex justify-between text-[#9C5550] bg-[#F4ECE6] p-2 rounded-xl border border-[#D8C6C3]">
                  <span>Advance Deposit (Due Now to Lock Slot):</span>
                  <strong className="font-bold">₹{advanceDeposit}</strong>
                </div>

                <div className="flex justify-between text-[#879B83] font-semibold pt-1">
                  <span>Remaining Balance (Payable at Studio):</span>
                  <span>₹{balanceDue}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#786866] pt-2 border-t border-[#D8C6C3]/60 leading-relaxed">
                Your ₹200 deposit directly offsets your service total on appointment day. Zero surprise hidden fees.
              </p>
            </div>

            {/* STUDIO INFO & RESERVATION CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
                <h3 className="font-heading font-medium text-xl text-[#313851]">
                  Private Atelier Protocol
                </h3>
                <span className="text-xs text-[#879B83] font-medium">By Appointment Only</span>
              </div>

              <div className="space-y-3 text-xs text-[#453A3C]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#9C5550] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#313851] block">Private Studio Atelier</strong>
                    <span>Exclusive 1-on-1 private appointments. Full location address, entry gate, and arrival details are shared upon booking confirmation.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#A87F45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#313851] block">Operating Hours</strong>
                    <span>Tuesday – Sunday: 10:00 AM – 7:00 PM (By Appointment)</span>
                    <span className="block text-[#786866]">Monday: Closed for Studio Disinfection & Art Preparation</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#313851] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#313851] block">Studio Concierge</strong>
                    <span>+91 93614 05676 • concierge@nailsbyhelina.com</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 text-xs text-[#786866] space-y-1.5">
                <p className="font-medium text-[#313851]">✨ Atelier Experience Amenities</p>
                <p>Complimentary private guest parking, sanitized private suite, and artisanal refreshment bar included with every appointment.</p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PORTFOLIO SECTION: BEFORE & AFTER TRANSFORMATION SLIDER */}
      <StudioPortfolio />

    </div>
  );
}
