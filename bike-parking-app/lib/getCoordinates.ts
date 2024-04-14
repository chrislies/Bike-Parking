async function getCoordinates(): Promise<MarkerData[] | null> {
  try {
    let allData: any[] = [];
    let offset = 0;
    let hasMoreData = true;
    while (hasMoreData) {
      const bikeRacksResponse = await fetch(
        `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
        // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=1000&$offset=${offset}`
      );
      const bikeRacksData: MarkerData[] = await bikeRacksResponse.json();
      const combinedData: MarkerData[] = [...bikeRacksData];

      if (combinedData.length === 0) {
        hasMoreData = false;
      } else {
        allData = [...allData, ...combinedData];
        offset += 50000;
      }
    }

    const streetSignsResponse = await fetch(
      `https://raw.githubusercontent.com/chrislies/Bike-Parking/backend_streetsigns/backend/db.json`
    );

    const streetSignsData: { street_signs: MarkerData[] } =
      await streetSignsResponse.json();
    const limitData = streetSignsData.street_signs.slice(0, 20000);
    // const limitData = streetSignsData.street_signs.slice(0, 1000);
    const combinedData: MarkerData[] = [...limitData];

    allData = [...allData, ...combinedData];

    // prettier-ignore
    const info: MarkerData[] = allData.map((item) => ({
      x: item.x || item.X,
      y: item.y || item.Y,
      id: item.site_id ? `R${item.site_id.substring(1)}` : `S.${item.index}`,
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

export default getCoordinates;
