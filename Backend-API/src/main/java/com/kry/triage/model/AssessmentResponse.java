package com.kry.triage.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResponse {
    private String recommendation;
    private List<String> availableSlots;
}
