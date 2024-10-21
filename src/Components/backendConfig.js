import axios from "axios";

const API_BACKEND = "http://localhost:8080/api";

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

export const updateSaveDeleteLocations = async (locations, routeId) => { // takes route id and current locations Array
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
