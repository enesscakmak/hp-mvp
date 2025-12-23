const API_BASE_URL = 'http://localhost:5069/api';

export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    post: async <T>(endpoint: string, data: any): Promise<T> => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `API Error: ${response.statusText}`);
        }
        // Handle non-JSON responses (like simple strings)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            return (await response.text()) as unknown as T;
        }
    },

    put: async <T>(endpoint: string, data: any): Promise<T> => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }
        return response.json();
    },

    delete: async (endpoint: string): Promise<void> => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
    }
};
