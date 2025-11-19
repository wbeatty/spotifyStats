import { SpotifyArtist, SpotifyTrack } from './types';

const BASE_URL = "https://api.spotify.com/v1";

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

async function fetchWebApi(endpoint: string, token: string, method: string = "GET", body?: any) {
  const options: RequestInit = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}/${endpoint}`, options);
  
  if (!res.ok) {
     if (res.status === 401) {
        // Handle token expiration if needed, for now just throw
        throw new Error("Token expired or invalid");
     }
     throw new Error(`Request failed: ${res.statusText}`);
  }

  return await res.json();
}

export const getTopTracks = async (token: string, timeRange: TimeRange = 'medium_term', limit: number = 20): Promise<SpotifyTrack[]> => {
  const data = await fetchWebApi(`me/top/tracks?time_range=${timeRange}&limit=${limit}`, token);
  return data.items;
};

export const getTopArtists = async (token: string, timeRange: TimeRange = 'medium_term', limit: number = 20): Promise<SpotifyArtist[]> => {
  const data = await fetchWebApi(`me/top/artists?time_range=${timeRange}&limit=${limit}`, token);
  return data.items;
};

export const getUserProfile = async (token: string) => {
  return await fetchWebApi("me", token);
};

