package com.kry.triage.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String confirmationId;
    private String slot;
    private String recommendation;
}
