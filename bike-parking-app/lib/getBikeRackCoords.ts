async function getBikeRackCoords(): Promise<MarkerData[] | null> {
  try {
    let allData: any[] = [];
    let offset = 0;
    const bikeRacksResponse = await fetch(
      // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
      // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=1000&$offset=${offset}`
      `https://data.cityofnewyork.us/resource/592z-n7dk.json?$limit=1000&$offset=${offset}`
    );
    const bikeRacksData: MarkerData[] = await bikeRacksResponse.json();
    allData = [...allData, ...bikeRacksData];

    // prettier-ignore
    allData = allData.map((item) => ({
      x: item.x || item.longitude,
      y: item.y || item.latitude,
      id: item.site_id && `R${item.site_id.slice(1)}`,
      address: item.ifoaddress,
      rack_type: item.racktype,
      date_inst: item.date_inst,
      favorite: false,
      type: "rack",
    }));

    return allData.length > 0 ? allData : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getBikeRackCoords;
