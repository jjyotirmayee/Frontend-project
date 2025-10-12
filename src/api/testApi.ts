import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Django backend

export async function fetchTestQuestions(subject: string) {
  try {
    const response = await axios.get(`${BASE_URL}/test/${subject.toLowerCase()}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test questions:", error);
    return [];
  }
}
