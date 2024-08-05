import axios from "@/api/axios";

const env = "prod";

const baseUrl = `${
  env == "prod"
    ? "https://weconnect-server-kn0o.onrender.com"
    : "http://localhost:3000"
}`;

export async function getProvidersByFilters(filters = {}) {
  try {
    const response = await axios.post("users/providers", filters);
    return response;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error response:", error.response);
      return { error: error.response.data };
    } else if (error.request) {
      // Request was made but no response received
      console.error("Error request:", error.request);
      return { error: "No response received from server" };
    } else {
      // Something else happened while setting up the request
      console.error("Error message:", error.message);
      return { error: error.message };
    }
  }
}

export async function getProviderById(id) {
  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getProviderCategories(providerId) {
  try {
    const res = await fetch(`${baseUrl}/api/providerCategory/${providerId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getProviderAppointments(providerId) {
  try {
    const res = await fetch(
      `${baseUrl}/api/appointments/provider/${providerId}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getProviderAvailableTimeSlots(
  providerId,
  date,
  serviceDuration
) {
  try {
    const res = await fetch(`${baseUrl}/api/availabilities/${providerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, serviceDuration }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function createAppointment(appointment) {
  try {
    const res = await fetch(`${baseUrl}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
