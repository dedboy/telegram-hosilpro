// Use environment variable, fallback to /api/v1 for proxy logic
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const getHeaders = () => {
  const initData = window.Telegram?.WebApp?.initData || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `tma ${initData}`,
  };
};

export const fetchPlots = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/plots/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    // Return the first plot as the dashboard is built for a single plot currently
    if (data && data.length > 0) {
      return data[0];
    }
    return {
      size: 'Noma\'lum',
      soilType: 'Noma\'lum',
      crops: []
    };
  } catch (error) {
    console.error("Error fetching plots:", error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const submitTaskCompletion = async (taskId, photoBlob) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete/`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting task completion:", error);
    throw error;
  }
};

export const fetchReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const submitReport = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        crop_type: data.crop, 
        issue_description: data.description 
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting report:", error);
    throw error;
  }
};

export const fetchWeather = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/?t=${Date.now()}`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export const submitCrop = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        area: data.area,
        stage: "Kutish jarayonida",
        progress: 0
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting crop:", error);
    throw error;
  }
};

export const fetchAIAnalysis = async (cropType, issueDescription) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-analyze/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        crop_type: cropType,
        issue_description: issueDescription
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return null;
  }
};

export const fetchProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/?t=${Date.now()}`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
