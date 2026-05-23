import axios from 'axios';

// Free API key from https://countrystatecity.in (sign up → Dashboard → API Key)
const CSC_API_KEY = '40d582872edab02edd68530a1f3d03166ea282f65587b5b59010136776954ad2';
const BASE = 'https://api.countrystatecity.in/v1/countries/IN';
const headers = { 'X-CSCAPI-KEY': CSC_API_KEY };

let statesCache: { name: string; iso2: string }[] = [];
const citiesCache: Record<string, string[]> = {};

export const getIndianStates = async (): Promise<string[]> => {
  if (statesCache.length > 0) return statesCache.map((s) => s.name);
  const { data } = await axios.get(`${BASE}/states`, { headers });
  statesCache = data.map((s: any) => ({ name: s.name, iso2: s.iso2 }));
  return statesCache.map((s) => s.name);
};

export const getCitiesByState = async (stateName: string): Promise<string[]> => {
  if (citiesCache[stateName]) return citiesCache[stateName];
  const state = statesCache.find((s) => s.name === stateName);
  if (!state) return [];
  const { data } = await axios.get(`${BASE}/states/${state.iso2}/cities`, { headers });
  const cities = data.map((c: any) => c.name);
  citiesCache[stateName] = cities;
  return cities;
};
