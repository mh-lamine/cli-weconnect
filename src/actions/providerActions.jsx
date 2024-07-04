export async function getProvidersByFilters(filters = {}) {
  try {
    const res = await fetch("http://localhost:3000/api/users/providers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getProviderById(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export async function getProviderCategories(providerId) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/providerCategory/${providerId}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}