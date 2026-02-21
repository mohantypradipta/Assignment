package com.kry.triage.service;

import com.kry.triage.model.AssessmentRequest;
import com.kry.triage.model.AssessmentResponse;
import com.kry.triage.model.BookingRequest;
import com.kry.triage.model.BookingResponse;
import com.kry.triage.util.SlotCalculator;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for handling medical triage assessments and appointments.
 */
@Service
public class AssessmentService {
    private final AtomicInteger bookingCounter = new AtomicInteger(1000);
    private final Map<String, BookingResponse> bookings = new ConcurrentHashMap<>();

    /**
     * Process patient assessment and return recommendation with available slots.
     * 
     * Score ranges:
     * - 5-7: Chat (self-care guidance)
     * - 8-11: Nurse (consultation)
     * - 12-15: Doctor (full evaluation)
     */
    public AssessmentResponse assess(AssessmentRequest request) {
        int score = request.getScore();

        // Validate score
        if (score < 5 || score > 15) {
            throw new IllegalArgumentException("Score must be between 5 and 15");
        }

        String recommendation = getRecommendation(score);
        List<String> availableSlots = SlotCalculator.calculateAvailableSlots();

        return new AssessmentResponse(recommendation, availableSlots);
    }

    /**
     * Book an appointment for the patient.
     */
    public BookingResponse bookAppointment(BookingRequest request) {
        String slot = request.getSlot();
        String recommendation = request.getRecommendation();

        if (slot == null || slot.isEmpty()) {
            throw new IllegalArgumentException("Slot is required");
        }

        if (recommendation == null || recommendation.isEmpty()) {
            throw new IllegalArgumentException("Recommendation is required");
        }

        // Generate confirmation ID
        String confirmationId = generateConfirmationId();

        BookingResponse response = new BookingResponse(confirmationId, slot, recommendation);
        bookings.put(confirmationId, response);

        return response;
    }

    /**
     * Get recommendation based on score.
     */
    private String getRecommendation(int score) {
        if (score <= 7) {
            return "Chat";
        } else if (score <= 11) {
            return "Nurse";
        } else {
            return "Doctor";
        }
    }

    /**
     * Generate a unique confirmation ID.
     */
    private String generateConfirmationId() {
        int id = bookingCounter.incrementAndGet();
        return "CONF-" + String.format("%05d", id % 100000);
    }

    /**
     * Get booking details by confirmation ID.
     */
    public BookingResponse getBooking(String confirmationId) {
        return bookings.get(confirmationId);
    }
}
