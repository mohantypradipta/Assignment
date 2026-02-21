package com.kry.triage.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentRequest {
    @Min(value = 5, message = "Score must be at least 5")
    @Max(value = 15, message = "Score must be at most 15")
    private int score;
}
