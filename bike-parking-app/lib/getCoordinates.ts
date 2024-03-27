interface DataItem {
  x?: number;
  y?: number;
  site_id?: string;
  ifoaddress?: string;
  rack_type?: string;
  date_inst?: string;
  order_number?: string;
  on_street?: string;
  from_street?: string;
  to_street?: string;
  sign_description?: string;
  sign_x_coord?: number;
  sign_y_coord?: number;
}

async function getCoordinates(): Promise<DataItem[] | null> {
  try {
    let allData: DataItem[] = [];
    let offset = 0;
    let hasMoreData = true;
    while (hasMoreData) {
      const [bikeRacksResponse, streetSignsResponse] = await Promise.all([
        fetch(
          `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
          // `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=100&$offset=${offset}`
        ),
        fetch(
          // `https://data.cityofnewyork.us/resource/nfid-uabd.json?$limit=50000&$offset=${offset}`
          `https://data.cityofnewyork.us/resource/nfid-uabd.json?$limit=100&$offset=${offset}`
        ),
      ]);

      const [bikeRacksData, streetSignsData] = await Promise.all([
        bikeRacksResponse.json(),
        streetSignsResponse.json(),
      ]);

      const combinedData: DataItem[] = [
        ...bikeRacksData.map((item: DataItem) => ({ ...item })),
        ...streetSignsData.map((item: DataItem) => ({ ...item })),
      ];

      if (combinedData.length === 0) {
        hasMoreData = false;
      } else {
        allData = [...allData, ...combinedData];
        offset += 50000;
      }
    }

    const info: DataItem[] = allData.map((item) => ({
      x: item.x,
      y: item.y,
      site_id: item.site_id,
      ifoaddress: item.ifoaddress,
      rack_type: item.rack_type,
      date_inst: item.date_inst,
      order_number: item.order_number,
      on_street: item.on_street,
      from_street: item.from_street,
      to_street: item.to_street,
      sign_description: item.sign_description,
      sign_x_coord: item.sign_x_coord,
      sign_y_coord: item.sign_y_coord,
    }));

    return info.length > 0 ? info : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
