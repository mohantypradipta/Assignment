import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface AssessmentRequest {
  score: number;
}

export interface AssessmentResponse {
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
  availableSlots: string[];
}

export interface BookingRequest {
  slot: string;
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
}

export interface BookingResponse {
  confirmationId: string;
  slot: string;
  recommendation: 'Chat' | 'Nurse' | 'Doctor';
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assessmentAPI = {
  submitAssessment: async (score: number): Promise<AssessmentResponse> => {
    const response = await client.post<AssessmentResponse>('/assessment', { score });
    return response.data;
  },

  bookAppointment: async (
    slot: string,
    recommendation: 'Chat' | 'Nurse' | 'Doctor'
  ): Promise<BookingResponse> => {
    const response = await client.post<BookingResponse>('/booking', {
      slot,
      recommendation,
    });
    return response.data;
  },
};
