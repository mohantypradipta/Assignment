package com.kry.triage.controller;

import com.kry.triage.model.AssessmentRequest;
import com.kry.triage.model.AssessmentResponse;
import com.kry.triage.model.BookingRequest;
import com.kry.triage.model.BookingResponse;
import com.kry.triage.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for medical triage assessment and booking endpoints.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentController {
    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    /**
     * POST /api/assessment
     * Submit patient assessment and get recommendation with available slots.
     */
    @PostMapping("/assessment")
    public ResponseEntity<AssessmentResponse> submitAssessment(
            @Valid @RequestBody AssessmentRequest request) {
        try {
            AssessmentResponse response = assessmentService.assess(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/booking
     * Book an appointment slot.
     */
    @PostMapping("/booking")
    public ResponseEntity<BookingResponse> bookAppointment(
            @Valid @RequestBody BookingRequest request) {
        try {
            BookingResponse response = assessmentService.bookAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/booking/{confirmationId}
     * Retrieve booking details by confirmation ID.
     */
    @GetMapping("/booking/{confirmationId}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String confirmationId) {
        BookingResponse booking = assessmentService.getBooking(confirmationId);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Medical Triage API is running");
    }
}
