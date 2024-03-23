import getUserCoordinates from "./getUserCoordinates";

interface DataItem {
  longitude: number;
  latitude: number;
  Site_ID: string;
  IFOAddress: string;
  RackType: string;
  
}

async function getCoordinates(): Promise<DataItem[] | null> {
  try {
    const userLocation = await getUserCoordinates();
    const response = await fetch(
      `https://bike-parking.onrender.com/Parking_data/?X=${userLocation.longitude}&Y=${userLocation.latitude}`
    );
    const jsonData = await response.json();

    
    const coordinates = jsonData.map((item: any) => ({
      latitude: item.y_coordinate,
      longitude: item.x_coordinate,
        Site_ID: item.site_id,
        IFOAddress: item.ifoaddress,
        RackType: item.racktype,
    }));

    return coordinates.length > 0 ? coordinates : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
