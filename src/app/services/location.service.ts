// Location service to get user's location based on IP address

interface IpapiResponse {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export async function getUserLocation(): Promise<string> {
  try {
    // Use ipapi.co to get location data based on IP
    const response = await fetch('https://ipapi.co/json');
    const data: IpapiResponse = await response.json();
    
    // Return city name or default
    return data.city || 'sua cidade';
  } catch (error) {
    console.error('Erro ao buscar cidade por IP:', error);
    // Return a default location if there's an error
    return 'sua cidade';
  }
}
