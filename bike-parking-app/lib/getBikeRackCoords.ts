async function getBikeRackCoords(): Promise<MarkerData[] | null> {
  try {
    let allData: any[] = [];
    let offset = 0;
    const bikeRacksResponse = await fetch(
      `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
      // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=1000&$offset=${offset}`
    );
    const bikeRacksData: MarkerData[] = await bikeRacksResponse.json();
    allData = [...allData, ...bikeRacksData];

    // prettier-ignore
    const info: MarkerData[] = allData.map((item) => ({
      x: item.x || item.X,
      y: item.y || item.Y,
      id: item.site_id ? `R${item.site_id.slice(1)}` : `S.${item.index}`,
      address: item.ifoaddress || `${item.on_street} ${item.from_street} ${item.to_street}`,
      rack_type: item.rack_type,
      date_inst: item.date_inst,
      sign_description: item.sign_description,
      sign_code: item.sign_code,
      favorite: false,
      type: item.rack_type ? "rack" : "sign",
    }));

    return info.length > 0 ? info : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getBikeRackCoords;
