async function getCoordinates(): Promise<MarkerData[] | null> {
  try {
    console.log("Fetching data from API");
    const startTotal = window.performance.now();
    const startRack = window.performance.now();
    let allData: any[] = [];
    let offset = 0;
    let hasMoreData = true;
    let rackTypes = new Map<string, number>();
    while (hasMoreData) {
      const bikeRacksResponse = await fetch(
        `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
        // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=1000&$offset=${offset}`
      );
      const bikeRacksData: MarkerData[] = await bikeRacksResponse.json();

      // Count the different types of racks
      // bikeRacksData.forEach((item: any) => {
      //   if (!rackTypes.has(item.rack_type)) {
      //     rackTypes.set(item.rack_type, 1);
      //   } else {
      //     const count = rackTypes.get(item.rack_type) || 0;
      //     rackTypes.set(item.rack_type, count + 1);
      //   }
      // });
      // console.log(rackTypes);
      //       rack types:
      // {"Bike Corral" => 759} // same as GFI sled
      // {"LARGE HOOP" => 11160}
      // {"WAVE RACK" => 1541}
      // {"U RACK" => 8612}
      // {"SMALL HOOP" => 9417}
      // {"UNDETERMINED" => 55}
      // {"WAVE RACK (PARKS)" => 18}
      // {"STAPLE (PARKS)" => 1}
      // {"DOT SLED (BLACK)" => 7}
      // {"GFI SLED (SILVER)" => 48}
      // {"Opal Rack (Parks)" => 18}

      // Filter bike data by rack_type
      // const filteredBikeRacksData = bikeRacksData.filter(
      //   (item: MarkerData) =>
      //     item.rack_type?.toLowerCase() === "UNDETERMINED".toLowerCase()
      // );

      // Filter bike data by year
      // const filteredBikeRacksData = bikeRacksData.filter((item: MarkerData) => {
      //   if (item.date_inst) {
      //     const year = new Date(item.date_inst).getFullYear();
      //     if (year === 1900) {
      //       item.date_inst = "N/A";
      //     }
      //   }
      // });

      const combinedData: MarkerData[] = [...bikeRacksData];

      if (combinedData.length === 0) {
        hasMoreData = false;
      } else {
        allData = [...allData, ...combinedData];
        offset += 50000;
      }
    }

    const startSign = window.performance.now();
    const streetSignsResponse = await fetch(
      `https://raw.githubusercontent.com/chrislies/Bike-Parking/backend_streetsigns/backend/db.json`
    );

    const streetSignsData: { street_signs: MarkerData[] } =
      await streetSignsResponse.json();
    const limitData = streetSignsData.street_signs.slice(0, 20000);
    // const limitData = streetSignsData.street_signs.slice(0, 1000);
    const combinedData: MarkerData[] = [...limitData];

    allData = [...allData, ...combinedData];
    const endSign = window.performance.now();

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

    const endTotal = window.performance.now();
    console.log(`
      Total time: ${(endTotal - startTotal) / 1000}
      Rack time: ${(startSign - startRack) / 1000}
      Sign time: ${(endSign - startSign) / 1000}
    `);
    return info.length > 0 ? info : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
