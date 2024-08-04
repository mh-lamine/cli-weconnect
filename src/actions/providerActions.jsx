import axios from "@/api/axios";

const env = "prod";

const baseUrl = `${
  env == "prod"
    ? "https://weconnect-server-kn0o.onrender.com"
    : "http://localhost:3000"
}`;

export async function getProvidersByFilters(filters = {}) {
  return axios.post("/users/providers", filters);
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
