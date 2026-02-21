# Backend - Medical Triage API

Spring Boot REST API for medical triage assessment and appointment booking.

## Installation

```bash
mvn clean install
```

## Running the Application

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## Building

```bash
mvn clean package
java -jar target/medical-triage-api-1.0.0.jar
```

## API Endpoints

### POST /api/assessment
Submit patient symptom assessment and receive recommendation with available slots.

**Request:**
```json
{
  "score": 11
}
```

**Response:**
```json
{
  "recommendation": "Nurse",
  "availableSlots": [
    "2026-02-20T09:00:00",
    "2026-02-20T09:15:00"
  ]
}
```

### POST /api/booking
Book an appointment slot.

**Request:**
```json
{
  "slot": "2026-02-20T09:15:00",
  "recommendation": "Nurse"
}
```

**Response:**
```json
{
  "confirmationId": "CONF-01001",
  "slot": "2026-02-20T09:15:00",
  "recommendation": "Nurse"
}
```

### GET /api/booking/{confirmationId}
Retrieve booking confirmation details.

### GET /api/health
Health check endpoint.

## Running Tests

```bash
mvn test
```

## Architecture

### Services
- **AssessmentService**: Handles assessment logic, recommendation calculation, and booking management

### Utilities
- **SlotCalculator**: Calculates available appointment slots based on clinician availability and break times

### Models
- **AssessmentRequest/Response**: Assessment submission and recommendations
- **BookingRequest/Response**: Appointment booking

## Assumptions

### Scheduling Rules
- 4 clinicians work daily
- Each clinician works 8 hours per day
- Clinic hours: 08:00-18:00
- Each clinician takes a 1-hour break exactly 4 hours after their start time
- Clinician staggered start times: 08:00, 10:00, 12:00, 14:00
- This ensures continuous availability with rotating break times

### Slot Calculation
- 15-minute appointment slots
- Available slots shown for next 3 calendar days
- No past slots are returned
- A slot is available if at least one clinician is not on break and within working hours

### Recommendations
- Score 5-7: Chat (self-care guidance)
- Score 8-11: Nurse (consultation)
- Score 12-15: Doctor (full evaluation)

## Implementation Notes

- No database required; in-memory state management is used
- Bookings are stored in a ConcurrentHashMap for thread-safe access
- Confirmation IDs are generated sequentially with "CONF-" prefix

## What Would Be Improved

1. **Persistence**: Add database layer (JPA/Hibernate) for persistent storage of bookings and audit trails
2. **Authentication**: Implement JWT-based authentication for patients
3. **Validation**: Add comprehensive input validation and error handling
4. **Monitoring**: Add Actuator and Micrometer for metrics and health monitoring
5. **Documentation**: Add Swagger/OpenAPI documentation
6. **Scheduling**: Integrate Spring Scheduler for automatic cleanup of old bookings
7. **Logging**: More detailed audit logging for compliance
8. **Tests**: Add integration tests and more comprehensive unit tests
9. **Configuration**: Externalize clinic hours, clinician count, and break times to configuration
10. **Caching**: Cache slot calculations for better performance
