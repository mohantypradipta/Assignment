package com.kry.triage.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    @NotBlank(message = "Slot is required")
    private String slot;
    
    @NotBlank(message = "Recommendation is required")
    private String recommendation;
}
