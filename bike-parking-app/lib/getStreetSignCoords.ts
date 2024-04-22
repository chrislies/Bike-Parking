async function getStreetSignCoords(): Promise<MarkerData[] | null> {
  try {
    console.log("Fetching data from API");
    const startTotal = window.performance.now();
    const startRack = window.performance.now();
    let allData: any[] = [];

    const streetSignsResponse = await fetch(
      `https://raw.githubusercontent.com/chrislies/Bike-Parking/backend_streetsigns/backend/db.json`
    );

    const streetSignsData: { street_signs: MarkerData[] } =
      await streetSignsResponse.json();
    const limitData = streetSignsData.street_signs.slice(0, 20000);
    // const limitData = streetSignsData.street_signs.slice(0, 1000);

    // allData = [...allData, ...streetSignsData.street_signs];
    allData = [...allData, ...limitData];
    const endSign = window.performance.now();

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

export default getStreetSignCoords;
