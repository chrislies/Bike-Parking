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
    const info: MarkerData[] = allData.map((item) => ({
      x: item.x,
      y: item.y,
      id: item.site_id && `R${item.site_id.slice(1)}`,
      address: item.ifoaddress,
      rack_type: item.rack_type,
      date_inst: item.date_inst,
      favorite: false,
      type: "rack",
    }));

    return info.length > 0 ? info : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getBikeRackCoords;
