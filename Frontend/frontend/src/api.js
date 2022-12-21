import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const shortenUrl = (url, shortUrl) => {
  return axios.post(`${API_BASE_URL}/shorten`, {
    original_url: url,
    short_url: shortUrl,
  });
};

export const redirectUrl = (shortUrl) => {
  return axios.get(`${API_BASE_URL}/${shortUrl}`);
};

export const getAnalytics = (shortUrl) => {
  return axios.get(`${API_BASE_URL}/analytics/${shortUrl}`);
};

export const deleteUrl = (shortUrl) => {
  return axios.delete(`${API_BASE_URL}/${shortUrl}`);
};

export const listUrls = () => {
  return axios.get(`${API_BASE_URL}/list`);
};
