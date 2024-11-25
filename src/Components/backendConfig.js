import axios from "axios";

const API_BACKEND = "http://localhost:8080/api";

// locations

export const getAllLocations = async (routeId) => {
  try {
    const response = await axios.get(
      `${API_BACKEND}/locations/spec/${routeId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // method returns array of locations
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const updateSaveDeleteLocations = async (locations, routeId) => {
  // takes route id and current locations Array
  try {
    const response = await axios.put(
      `${API_BACKEND}/locations/${routeId}`, // uses put method to send data
      locations,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // takes response with ids, and uses them just update them later
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

// directions

export const getAllDirections = async (routeId) => {
  try {
    const response = await axios.get(
      `${API_BACKEND}/directions/spec/${routeId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // method returns array of locations
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const updateSaveDeleteDirections = async (directions, routeId) => {
  try {
    const response = await axios.put(
      `${API_BACKEND}/directions/${routeId}`, // uses put method to send data
      directions,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // takes response with ids, and uses them just update them later
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

// routes
export const getSelectedRoute = async (routeId) => {
  try {
    const response = await axios.get(`${API_BACKEND}/routes/${routeId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // method returns selected route
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const updateSelectedRoute = async (routeId) => {
  try {
    const response = await axios.put(`${API_BACKEND}/routes`, routeId, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // method returns updated route
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const deleteSelectedRoute = async (routeId) => {
  try {
    const response = await axios.delete(`${API_BACKEND}/routes/${routeId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // method returns deleted route
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const getAllRoutes = async (routeId) => {
  try {
    const response = await axios.put(`${API_BACKEND}/routes/all`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // method returns selected route
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};
