import React, { useEffect, useState } from 'react';
import { FEATURES } from '../config/features';
import { settingsService } from '../services/settingsService';
import StudioBooking from '../features/studio-booking/StudioBooking';
import StudioComingSoon from '../components/StudioComingSoon';

/**
 * Nailsbyhelina Studio Experience Router
 * 
 * Preserves the full physical studio booking codebase in:
 * src/features/studio-booking/StudioBooking.jsx
 * 
 * Controlled dynamically by database setting:
 * site_settings.studio_booking_enabled
 * 
 * When false -> Renders <StudioComingSoon /> (Online store priority)
 * When true  -> Renders <StudioBooking /> (Live calendar appointment scheduler)
 */
export default function Book() {
  const [studioBookingEnabled, setStudioBookingEnabled] = useState(FEATURES.STUDIO_BOOKING_ENABLED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkStudioSetting() {
      try {
        const settings = await settingsService.getSettings();
        if (mounted && settings) {
          setStudioBookingEnabled(Boolean(settings.studio_booking_enabled));
        }
      } catch (err) {
        console.warn('Could not fetch studio setting, using default', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkStudioSetting();

    return () => {
      mounted = false;
    };
  }, []);

  if (studioBookingEnabled) {
    return <StudioBooking />;
  }

  return <StudioComingSoon />;
}
