import axios from "axios";

export async function getProvidersByFilters(filters = {}) {
  try {
    const response = await axios.post("/api/users/providers", filters);
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

export async function getProviderAvailableTimeSlots(
  providerId,
  date,
  serviceDuration
) {
  try {
    const response = await axios.post(`/api/availabilities/${providerId}`, {
      date,
      serviceDuration,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getSalonAvailableTimeSlots(salonId, date, service) {
  try {
    const { data } = await axios.post(`/api/availabilities/salon/${salonId}`, {
      date,
      service,
    });
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
