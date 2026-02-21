package com.kry.triage.util;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Utility class for calculating available appointment slots based on clinician availability.
 * 
 * Assumptions:
 * - 4 clinicians are always available
 * - Each works 8 hours per day (08:00-18:00)
 * - Each takes a 1-hour break exactly 4 hours after they start
 * - Appointments are 15-minute slots
 * - Clinic hours: 08:00-18:00 local time
 * - Clinicians start at fixed times: 08:00, 10:00, 12:00, 14:00
 * - Calculate slots for next 3 calendar days (today + 2 more days)
 */
public class SlotCalculator {
    private static final int CLINICIANS_COUNT = 4;
    private static final int HOURS_PER_DAY = 8;
    private static final int BREAK_AFTER_HOURS = 4;
    private static final int BREAK_DURATION_MINUTES = 60;
    private static final int SLOT_DURATION_MINUTES = 15;
    private static final int CLINIC_START_HOUR = 8;
    private static final int CLINIC_END_HOUR = 18;
    private static final int DAYS_TO_SHOW = 3;

    // Clinician start times (offset from clinic start in hours)
    private static final int[] CLINICIAN_START_HOURS = { 0, 2, 4, 6 }; // 08:00, 10:00, 12:00, 14:00

    /**
     * Calculate available appointment slots for the next N days.
     * 
     * @return List of available slot times in ISO 8601 format
     */
    public static List<String> calculateAvailableSlots() {
        List<String> availableSlots = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentTime = now;

        // Generate slots for next 3 calendar days
        for (int dayOffset = 0; dayOffset < DAYS_TO_SHOW; dayOffset++) {
            LocalDateTime dayStart = currentTime.toLocalDate()
                    .atStartOfDay()
                    .plusDays(dayOffset)
                    .withHour(CLINIC_START_HOUR);

            LocalDateTime dayEnd = dayStart.withHour(CLINIC_END_HOUR);

            // Generate 15-minute slots for this day
            LocalDateTime slotTime = dayStart;
            while (slotTime.isBefore(dayEnd)) {
                // Skip slots in the past
                if (slotTime.isAfter(now)) {
                    // Check if at least one clinician is available
                    if (isSlotAvailable(slotTime)) {
                        availableSlots.add(slotTime.toString());
                    }
                }
                slotTime = slotTime.plusMinutes(SLOT_DURATION_MINUTES);
            }
        }

        return availableSlots;
    }

    /**
     * Check if at least one clinician is available for the given slot time.
     */
    private static boolean isSlotAvailable(LocalDateTime slotTime) {
        for (int clinician = 0; clinician < CLINICIANS_COUNT; clinician++) {
            if (isClinicianAvailable(clinician, slotTime)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a specific clinician is available for the given slot time.
     */
    private static boolean isClinicianAvailable(int clinicianIndex, LocalDateTime slotTime) {
        LocalDateTime dayStart = slotTime.toLocalDate().atStartOfDay().withHour(CLINIC_START_HOUR);
        LocalDateTime clinicianStartTime = dayStart.plusHours(CLINICIAN_START_HOURS[clinicianIndex]);

        // Clinician hasn't started their shift yet
        if (slotTime.isBefore(clinicianStartTime)) {
            return false;
        }

        // Calculate working hours since clinician started
        long hoursSinceStart = ChronoUnit.HOURS.between(clinicianStartTime, slotTime);

        // Clinician has worked more than 8 hours
        if (hoursSinceStart >= HOURS_PER_DAY) {
            return false;
        }

        // Check if in break period (4 hours after start, 1 hour duration)
        long breakStartHours = BREAK_AFTER_HOURS;
        long breakEndHours = breakStartHours + 1;

        if (hoursSinceStart >= breakStartHours && hoursSinceStart < breakEndHours) {
            return false;
        }

        return true;
    }
}
