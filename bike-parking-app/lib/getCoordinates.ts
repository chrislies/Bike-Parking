interface DataItem {
  longitude: string;
  latitude: string;
}

async function getCoordinates(): Promise<DataItem[]> {
  try {
    const response = await fetch(` http://bike-parking.onrender.com/Parking_data/?X=-73.941009&Y=40.618406`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    
    // Assuming the response data is an array of objects with 'longitude' and 'latitude' properties
    const coordinates: DataItem[] = data.map((item: any) => ({
      longitude: item.longitude,
      latitude: item.latitude,
    }));

    return coordinates;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
