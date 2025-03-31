// API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred');
    }
    return response.json();
};

// API functions
export const api = {
    // Authentication
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
    },

    register: async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return handleResponse(response);
    },

    // Crop Recommendations
    getRecommendations: async (data) => {
        const response = await fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // User Profile
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return handleResponse(response);
    },

    updateProfile: async (data) => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Search History
    getSearchHistory: async () => {
        const response = await fetch(`${API_BASE_URL}/search-history`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return handleResponse(response);
    },

    // Get crop recommendations
    async getRecommendations(formData) {
        try {
            // For now, return mock data
            return {
                recommendedCrops: [
                    {
                        name: "Soybean",
                        confidence: 0.85,
                        reasons: [
                            "Good nitrogen fixation for soil health",
                            "Compatible with previous crop",
                            "Suitable for current season"
                        ]
                    },
                    {
                        name: "Wheat",
                        confidence: 0.75,
                        reasons: [
                            "Traditional rotation crop",
                            "Good market demand",
                            "Suitable soil conditions"
                        ]
                    }
                ],
                soilHealth: {
                    pH: "6.5 - 7.0",
                    nitrogen: "Medium",
                    phosphorus: "High",
                    potassium: "Medium"
                },
                weatherForecast: {
                    temperature: "25-30°C",
                    rainfall: "Moderate",
                    humidity: "60-70%"
                }
            };
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    },

    // Get AQI recommendations
    async getAQIRecommendations(aqiValue) {
        try {
            // For now, return mock data
            return {
                status: aqiValue <= 50 ? "Good" : 
                        aqiValue <= 100 ? "Moderate" : 
                        aqiValue <= 150 ? "Unhealthy for Sensitive Groups" : 
                        aqiValue <= 200 ? "Unhealthy" : "Very Unhealthy",
                recommendations: [
                    "Consider using dust reduction techniques",
                    "Monitor air quality regularly",
                    "Plan activities based on AQI levels"
                ]
            };
        } catch (error) {
            console.error('Error getting AQI recommendations:', error);
            throw error;
        }
    }
}; 