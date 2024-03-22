interface DataItem {
  longitude: number;
  latitude: number;
}

function success(position: GeolocationPosition): DataItem {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const dataItem: DataItem = { latitude, longitude };
  // console.log(dataItem);
  return dataItem;
}

function error() {
  console.log("Unable to retrieve your location");
}

async function getUserCoordinates(): Promise<DataItem> {
  try {
    let userCoordinates: DataItem | null = null;
    
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((success, error) => {
        navigator.geolocation.getCurrentPosition(success, error);
      });

      userCoordinates = success(position);
    } else {
      console.log("Geolocation not supported");
    }

    if (!userCoordinates) {
      throw new Error("Failed to fetch user coordinates");
    }

    return userCoordinates;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user coordinates");
  }
}

export default getUserCoordinates;
