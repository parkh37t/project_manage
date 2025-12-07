const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token to localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - remove token and redirect to login
      removeAuthToken();
      window.location.href = '/login';
    }
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// ============================================
// AUTH API
// ============================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const register = async (userData: {
  username: string;
  password: string;
  name: string;
  role: string;
}): Promise<{ message: string }> => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// ============================================
// MEMBER API
// ============================================

export const getMembers = async (filters?: {
  group?: string;
  search?: string;
}): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters?.group) params.append('group', filters.group);
  if (filters?.search) params.append('search', filters.search);

  const query = params.toString();
  return apiRequest(`/members${query ? `?${query}` : ''}`);
};

export const getMember = async (id: string): Promise<any> => {
  return apiRequest(`/members/${id}`);
};

export const createMember = async (memberData: any): Promise<any> => {
  return apiRequest('/members', {
    method: 'POST',
    body: JSON.stringify(memberData),
  });
};

export const updateMember = async (id: string, memberData: any): Promise<any> => {
  return apiRequest(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(memberData),
  });
};

export const deleteMember = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/members/${id}`, {
    method: 'DELETE',
  });
};

// ============================================
// PROJECT API
// ============================================

export const getProjects = async (filters?: {
  status?: string;
}): Promise<any[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);

  const query = params.toString();
  return apiRequest(`/projects${query ? `?${query}` : ''}`);
};

export const getProject = async (id: string): Promise<any> => {
  return apiRequest(`/projects/${id}`);
};

export const createProject = async (projectData: any): Promise<any> => {
  return apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

export const updateProject = async (id: string, projectData: any): Promise<any> => {
  return apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
};

export const reviewProject = async (
  id: string,
  review: { status: string; comments: string }
): Promise<any> => {
  return apiRequest(`/projects/${id}/review`, {
    method: 'POST',
    body: JSON.stringify(review),
  });
};

export const deleteProject = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  });
};

// ============================================
// ANALYTICS API
// ============================================

export const getMonthlyMetrics = async (): Promise<any[]> => {
  return apiRequest('/analytics/monthly');
};

export const getGroupMetrics = async (): Promise<any[]> => {
  return apiRequest('/analytics/groups');
};

export const getYearlyGoal = async (): Promise<any> => {
  return apiRequest('/analytics/yearly-goal');
};
