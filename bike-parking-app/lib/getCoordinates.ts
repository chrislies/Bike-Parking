interface DataItem {
  longitude: string;
  latitude: string;
}
//
// Utilize parallel data fetching
async function getCoordinates(): Promise<DataItem[]> {
  try {
    let allData: DataItem[] = [];
    let offset = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      const [bikeRacksResponse, streetSignsResponse] = await Promise.all([
        fetch(
          `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}`
        ),
        fetch(
          `https://data.cityofnewyork.us/resource/nfid-uabd.json?$limit=50000&$offset=${offset}`
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

    return allData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
