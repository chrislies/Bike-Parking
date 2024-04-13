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
  sign_code?: string;
  X?: number;
  Y?: number;
  favorite: boolean;
}

async function getCoordinates2(): Promise<DataItem[] | null> {
  try {
    let allData: DataItem[] = [];
    let offset = 0;
    const [streetSignsResponse] = await Promise.all([
      fetch(
        // `https://data.cityofnewyork.us/resource/nfid-uabd.json?$limit=1&$offset=${offset}`
        `https://raw.githubusercontent.com/chrislies/Bike-Parking/backend_streetsigns/backend/db.json`
      ),
    ]);

    const [streetSignsData] = await Promise.all([streetSignsResponse.json()]);
    console.log(streetSignsData.street_signs);

    const limitData = streetSignsData.street_signs.splice(0, 20000);
    console.log(limitData);

    const combinedData: DataItem[] = [
      ...limitData.map((item: DataItem) => ({ ...item })),
    ];

    allData = [...allData, ...combinedData];

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
      sign_code: item.sign_code,
      X: item.X,
      Y: item.Y,
      favorite: false,
    }));

    return info.length > 0 ? info : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates2;
