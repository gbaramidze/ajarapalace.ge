'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Calendar, Clock, Phone, User, MessageSquare, CheckCircle2, Utensils, AlertCircle, Info, Minus, Plus, Map } from 'lucide-react';

export default function ReservationPage() {
  const { t } = useLanguage();

  const getInitialDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 4);
    const dateStr = now.toISOString().split('T')[0];
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    return {
      date: dateStr,
      time: `${hoursStr}:${minutesStr}`
    };
  };

  const initial = getInitialDateTime();

  const [formData, setFormData] = useState({
    name: '',
    phone: '+995 ',
    zone: '1 этаж',
    guests: '2',
    date: initial.date,
    time: initial.time,
    comments: ''
  });

  const [todayISO, setTodayISO] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTodayISO(new Date().toISOString().split('T')[0]);
  }, []);

  const zones = [
    { id: '1 этаж', label: t.floor1, desc: t.floor1Desc },
    { id: '2 этаж', label: t.floor2, desc: t.floor2Desc },
    { id: 'Веранда', label: t.veranda, desc: t.verandaDesc }
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+995')) {
      const digits = val.replace(/\D/g, '');
      val = '+995 ' + digits;
    } else if (!val.startsWith('+995 ')) {
      val = '+995 ' + val.substring(4).trimStart();
    }
    setFormData(prev => ({ ...prev, phone: val }));
  };

  const handleZoneSelect = (zoneId: string) => {
    let updatedGuests = formData.guests;
    if (zoneId === 'Веранда' && parseInt(formData.guests, 10) > 4) {
      updatedGuests = '4';
    }
    setFormData(prev => ({ ...prev, zone: zoneId, guests: updatedGuests }));
    setError('');
  };

  const handleAddGuest = () => {
    const current = parseInt(formData.guests, 10) || 1;
    if (formData.zone === 'Веранда' && current >= 4) {
      setError(t.verandaMaxGuestsError);
      return;
    }
    setError('');
    setFormData(prev => ({ ...prev, guests: (current + 1).toString() }));
  };

  const handleRemoveGuest = () => {
    const current = parseInt(formData.guests, 10) || 1;
    if (current > 1) {
      setError('');
      setFormData(prev => ({ ...prev, guests: (current - 1).toString() }));
    }
  };

  const validateReservationTime = (dateStr: string, timeStr: string, zoneStr: string, guestsStr: string): string | null => {
    if (zoneStr === 'Веранда' && parseInt(guestsStr, 10) > 4) {
      return t.verandaMaxGuestsError;
    }

    if (!dateStr || !timeStr) return null;
    const selectedDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();

    if (isNaN(selectedDate.getTime())) {
      return t.reservationError;
    }

    if (selectedDate.getTime() < now.getTime()) {
      return t.reservationPastError;
    }

    const diffInHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 4) {
      return t.minReservationTimeError;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.trim() === '+995') {
      setError(t.orderError || 'Please enter your phone number');
      return;
    }

    const validationError = validateReservationTime(formData.date, formData.time, formData.zone, formData.guests);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(t.reservationError || 'Failed to send reservation');
      }
    } catch (err) {
      console.error(err);
      setError(t.reservationError || 'Failed to send reservation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t.reservationSuccess}</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            {t.adminContactDesc}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              href="/"
              className="bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-md"
            >
              {t.home}
            </a>
            <button
              onClick={() => {
                setSuccess(false);
                const fresh = getInitialDateTime();
                setFormData({
                  name: '',
                  phone: '+995 ',
                  zone: '1 этаж',
                  guests: '2',
                  date: fresh.date,
                  time: fresh.time,
                  comments: ''
                });
              }}
              className="bg-secondary text-secondary-foreground font-bold px-8 py-3.5 rounded-xl hover:bg-secondary/80 transition-colors"
            >
              {t.bookAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 md:py-6 max-w-2xl">
      <div className="text-center mb-4 md:mb-6 space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
          {t.tableReservation}
        </h1>
        <p className="text-muted-foreground text-xs md:text-base max-w-lg mx-auto">
          {t.reservationSubtitle}
        </p>
        <div className="pt-1">
          <a
            href="/streetview"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 rounded-full transition-colors shadow-sm"
          >
            <Map size={14} />
            <span>{t.streetview}</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-md space-y-6">
        
        {/* 1. Zone Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-foreground uppercase tracking-wider">
            1. {t.selectFloor}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((z) => (
              <button
                type="button"
                key={z.id}
                onClick={() => handleZoneSelect(z.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-full ${
                  formData.zone === z.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-background hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-foreground">{z.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.zone === z.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {formData.zone === z.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{z.desc}</span>
              </button>
            ))}
          </div>

          {/* Veranda Notice */}
          {formData.zone === 'Веранда' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-2xl text-sm space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold">
                <Info size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t.veranda}</span>
              </div>
              <p className="leading-relaxed text-xs md:text-sm pl-6">{t.verandaNotice}</p>
              <p className="font-bold text-xs pl-6 text-amber-800 dark:text-amber-300">⚠️ {t.verandaMaxGuestsError}</p>
            </div>
          )}
        </div>

        {/* 2. Date, Time & Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users size={14} className="text-primary" /> {t.guestsCount}
            </label>
            <div className="flex items-center justify-between bg-background border border-border rounded-xl p-1.5 h-[50px]">
              <button
                type="button"
                onClick={handleRemoveGuest}
                disabled={parseInt(formData.guests, 10) <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Minus size={18} />
              </button>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="text-lg">{formData.guests}</span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {parseInt(formData.guests, 10) === 1 ? t.guestUnit1 : parseInt(formData.guests, 10) < 5 ? t.guestUnit2 : t.guestUnitMany}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddGuest}
                disabled={formData.zone === 'Веранда' && parseInt(formData.guests, 10) >= 4}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-primary/20 text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> {t.date}
            </label>
            <input
              type="date"
              min={todayISO}
              value={formData.date}
              onChange={(e) => {
                const newDate = e.target.value;
                setFormData({ ...formData, date: newDate });
                const err = validateReservationTime(newDate, formData.time, formData.zone, formData.guests);
                setError(err || '');
              }}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock size={14} className="text-primary" /> {t.time}
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => {
                const newTime = e.target.value;
                setFormData({ ...formData, time: newTime });
                const err = validateReservationTime(formData.date, newTime, formData.zone, formData.guests);
                setError(err || '');
              }}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

        </div>

        {/* Minimum 4 hours rule info badge */}
        <div className="p-3 bg-secondary/80 rounded-xl text-xs text-muted-foreground flex items-center gap-2">
          <Clock size={16} className="text-primary shrink-0" />
          <span>{t.minReservationTimeError}</span>
        </div>

        {/* 3. Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User size={14} className="text-primary" /> {t.name}
            </label>
            <input
              type="text"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Phone size={14} className="text-primary" /> {t.phone} *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

        </div>

        {/* 4. Wishes / Comments */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary" /> {t.wishes}
          </label>
          <textarea
            rows={3}
            placeholder={t.wishesPlaceholder}
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            className="w-full bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:opacity-95 font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 size={20} />
              {t.submitReservation}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
