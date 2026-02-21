# Medical Triage & Booking Application

A full-stack healthcare application for patient symptom assessment and appointment booking. Patients answer a 5-question questionnaire, receive care recommendations, and can book appointments with available clinicians.

## Architecture

```
Kry-Assignment/
├── Frontend-SPA/         # React + TypeScript single-page application
└── Backend-API/          # Spring Boot REST API
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **SCSS** - Styling with CSS variables
- **Responsive Design** - Mobile-first approach

### Backend
- **Spring Boot 3.5** - REST API framework
- **Java 17** - Programming language
- **Maven** - Build tool
- **JUnit** - Unit testing
- **Lombok** - Boilerplate reduction

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 17+
- Maven 3.6+

### Frontend Setup

```bash
cd Frontend-SPA
npm install
npm run dev
```

Opens at `http://localhost:3000`

### Backend Setup

```bash
cd Backend-API
mvn clean install
mvn spring-boot:run
```

Runs at `http://localhost:8080`

## Features

### Questionnaire Flow
1. **5-Question Assessment** - Evaluate patient symptoms across key dimensions
2. **Progress Tracking** - Visual indicator shows question progress
3. **Backward Navigation** - Users can return to previous questions and modify answers
4. **Answer Persistence** - Responses are preserved when navigating back
5. **Cancel Anytime** - Return to home at any point

### Assessment & Recommendation
- **Intelligent Scoring** - 5-15 point scale based on symptom severity
- **Three-Tier Recommendations**:
  - Chat (5-7): Self-care guidance via chat
  - Nurse (8-11): Nurse consultation
  - Doctor (12-15): Full doctor evaluation
- **Real-time Slot Availability** - Backend calculates available appointments

### Appointment Booking
- **Smart Scheduling** - 4 clinicians with staggered shifts and breaks
- **15-Minute Slots** - Granular appointment scheduling
- **3-Day Window** - Book within next 3 calendar days
- **Confirmation** - Unique confirmation ID and booking details

### User Experience
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Smooth Animations** - Transitions between flow stages
- **Loading States** - User feedback during API calls
- **Error Handling** - Graceful error messages
- **Accessibility** - ARIA labels and keyboard navigation

## API Endpoints

### Assessment
```
POST /api/assessment
Request: { "score": 11 }
Response: { "recommendation": "Nurse", "availableSlots": [...] }
```

### Booking
```
POST /api/booking
Request: { "slot": "2026-02-20T09:15:00", "recommendation": "Nurse" }
Response: { "confirmationId": "CONF-01001", "slot": "...", "recommendation": "..." }
```

### Health Check
```
GET /api/health
```

## Scheduling Logic

### Clinician Availability
- **4 clinicians** work daily
- **Clinic hours**: 08:00-18:00
- **Working time per clinician**: 8 hours
- **Staggered start times**: 08:00, 10:00, 12:00, 14:00
- **Break**: 1 hour exactly 4 hours after each clinician starts

### Example Schedule
```
Clinician 1: 08:00-16:00 (break 12:00-13:00)
Clinician 2: 10:00-18:00 (break 14:00-15:00)
Clinician 3: 12:00-20:00 (break 16:00-17:00) [capped at 18:00]
Clinician 4: 14:00-22:00 (break 18:00-19:00) [capped at 18:00]
```

This ensures:
- Continuous coverage during clinic hours
- Each clinician gets a mandatory break
- Break times are staggered to maintain availability

## Running Tests

### Backend Tests
```bash
cd Backend-API
mvn test
```

Tests include:
- Slot calculation validation
- Time boundary checks
- Scheduling constraint verification

### Frontend Tests
Manual testing is recommended for UI flow. Key test scenarios:
- Complete 5-question flow
- Navigate backward and modify answers
- Cancel and restart
- Book appointment
- Error handling with backend unavailable

## Project Structure

### Frontend (`Frontend-SPA/`)
```
src/
├── components/          # Reusable UI components
│   ├── QuestionCard.tsx
│   ├── RecommendationCard.tsx
│   ├── SlotSelector.tsx
│   └── ConfirmationCard.tsx
├── pages/              # Page-level components
│   ├── Home.tsx
│   └── QuestionnaireFlow.tsx
├── store/              # State management (Zustand)
│   └── useTriageStore.ts
├── api/                # API integration
│   └── assessmentAPI.ts
├── styles/             # SCSS stylesheets
└── App.tsx            # Main component
```

### Backend (`Backend-API/`)
```
src/main/java/com/kry/triage/
├── controller/         # HTTP request handlers
│   └── AssessmentController.java
├── service/            # Business logic
│   └── AssessmentService.java
├── model/              # Data models
│   ├── AssessmentRequest.java
│   ├── AssessmentResponse.java
│   ├── BookingRequest.java
│   └── BookingResponse.java
├── util/               # Utilities
│   └── SlotCalculator.java
└── MedicalTriageApplication.java
```

## Assumptions & Design Decisions

### Frontend
1. **Zustand for State**: Lightweight alternative to Redux, sufficient for this app's state complexity
2. **Vite over Create React App**: Faster builds and better DX
3. **SCSS for Styling**: CSS variables for theming, modular organization
4. **In-Memory Storage**: Appointment data stored in localStorage for demo
5. **No Auth**: Questionnaire is publicly accessible (noted as optional)

### Backend
1. **Spring Boot**: Industry standard, excellent ecosystem, quick setup
2. **In-Memory State**: No database needed per requirements
3. **REST Architecture**: Simple, scalable API design
4. **Fixed Clinician Times**: Hardcoded for simplicity; easily configurable
5. **Slot Calculation**: Done on-demand for freshness; could be cached for scaling

### Scheduling Algorithm
1. **Staggered Starts**: Ensures continuous coverage during clinic hours
2. **Mandatory Breaks**: All clinicians take 1-hour break at designated time
3. **15-Minute Granularity**: Standard for healthcare appointments
4. **Simple Model**: Sufficient for demo; real system would be more complex

## Trade-offs & Future Improvements

### What Could Be Better
1. **Database Integration**: Currently in-memory; add PostgreSQL for persistence
2. **Authentication**: Add JWT tokens for secure patient access
3. **Validation**: More comprehensive input validation
4. **Error Handling**: Detailed error codes and messages
5. **Monitoring**: Add metrics, logging, and alerting
6. **Caching**: Cache slot calculations for better performance
7. **Testing**: More comprehensive unit and integration tests
8. **Documentation**: Swagger/OpenAPI for API docs
9. **Deployment**: Docker containers and CI/CD pipeline
10. **Security**: CORS, rate limiting, input sanitization

### Performance Optimizations
- Cache slot calculations with TTL
- Pagination for future endpoint expansions
- Database indexing on booking lookups
- CDN for frontend static assets

### Scalability Considerations
- Containerize with Docker
- Deploy with Kubernetes
- Add load balancing for multiple backend instances
- Use managed database service
- Implement message queue for async operations

## Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to static hosting (Netlify, Vercel, AWS S3, etc.)
```

### Backend
```bash
mvn clean package
# Deploy JAR to cloud platform (AWS, Azure, GCP, Heroku, etc.)
```

## Development Workflow

1. Start backend: `mvn spring-boot:run` (port 8080)
2. Start frontend: `npm run dev` (port 3000)
3. Open `http://localhost:3000`
4. Frontend proxies API calls to backend via Vite config
5. Hot reload enabled for both

## Support & Documentation

- [Frontend README](./Frontend-SPA/README.md)
- [Backend README](./Backend-API/README.md)

## License

MIT License - See individual project directories for details.
