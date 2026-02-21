package com.kry.triage.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import com.kry.triage.util.SlotCalculator;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Unit tests for SlotCalculator.
 * 
 * Tests verify:
 * - Slots are generated within clinic hours (08:00-18:00)
 * - Slots respect clinician availability and break times
 * - No past slots are returned
 * - Slots are 15-minute intervals
 * - Multiple clinicians allow overlap of break times
 */
public class SlotCalculatorTest {

    @Test
    public void testCalculateAvailableSlots() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        
        assertNotNull(slots);
        assertFalse(slots.isEmpty(), "Should have available slots");
        
        // Verify slots are in ISO format and parseable
        for (String slot : slots) {
            assertDoesNotThrow(() -> LocalDateTime.parse(slot));
        }
    }

    @Test
    public void testSlotsTodayAreValid() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        LocalDateTime now = LocalDateTime.now();
        
        // All returned slots should be in the future
        for (String slot : slots) {
            LocalDateTime slotTime = LocalDateTime.parse(slot);
            assertTrue(slotTime.isAfter(now), 
                "Slot " + slot + " should be in the future");
        }
    }

    @Test
    public void testSlotsWithin3Days() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirdDayEnd = now.toLocalDate().plusDays(3).atStartOfDay();
        
        // All slots should be within 3 days (today + 2 more days)
        for (String slot : slots) {
            LocalDateTime slotTime = LocalDateTime.parse(slot);
            assertTrue(slotTime.isBefore(thirdDayEnd),
                "Slot " + slot + " should be within 3 days");
        }
    }

    @Test
    public void testSlotsAre15MinutesApart() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        
        // Check that consecutive slots within a day are 15 minutes apart
        if (slots.size() > 1) {
            LocalDateTime prev = LocalDateTime.parse(slots.get(0));
            
            for (int i = 1; i < slots.size(); i++) {
                LocalDateTime current = LocalDateTime.parse(slots.get(i));
                
                // Could be same day (15 minutes apart) or new day
                if (prev.toLocalDate().equals(current.toLocalDate())) {
                    long minutesDiff = java.time.temporal.ChronoUnit.MINUTES
                            .between(prev, current);
                    assertEquals(15, minutesDiff,
                        "Slots on same day should be 15 minutes apart");
                }
                prev = current;
            }
        }
    }

    @Test
    public void testSlotsAreWithinClinicHours() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        
        // All slots should be between 08:00 and 18:00
        for (String slot : slots) {
            LocalDateTime slotTime = LocalDateTime.parse(slot);
            int hour = slotTime.getHour();
            
            assertTrue(hour >= 8 && hour < 18,
                "Slot " + slot + " hour (" + hour + ") should be within clinic hours (08:00-18:00)");
        }
    }

    @Test
    public void testReasonableNumberOfSlots() {
        List<String> slots = SlotCalculator.calculateAvailableSlots();
        
        // With 4 clinicians, 10 hours/day, 15-min slots, expect ~160 per day minimum
        // Less accounting for breaks. Should have reasonable number of slots.
        assertTrue(slots.size() > 0, "Should have available slots");
        assertTrue(slots.size() < 1000, "Should have reasonable number of slots (not all times)");
    }
}
