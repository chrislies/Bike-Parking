import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { formatDate } from "./formatDate";

async function getCoordinates(): Promise<MarkerData[] | null> {
  try {
    console.log("Fetching data from API");
    const debug = true;
    let supabase;
    if (!debug) {
      supabase = createSupabaseBrowserClient();
    }
    const startTotal = window.performance.now();
    const startRack = window.performance.now();
    let allData: any[] = [];
    let offset = 0;
    let rackTypes = new Map<string, number>();
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

    allData = [...allData, ...bikeRacksData];

    const startSign = window.performance.now();
    const streetSignsResponse = await fetch(
      `https://raw.githubusercontent.com/chrislies/Bike-Parking/backend_streetsigns/backend/db.json`
    );

    const streetSignsData: { street_signs: MarkerData[] } =
      await streetSignsResponse.json();
    // const limitData = streetSignsData.street_signs.slice(0, 20000);
    // const limitData = streetSignsData.street_signs.slice(0, 1000);

    allData = [...allData, ...streetSignsData.street_signs];
    // allData = [...allData, ...limitData];
    const endSign = window.performance.now();

    // prettier-ignore
    allData = allData.map((item) => ({
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

    // fetch data from the 'BlackList' table from Supabase
    // prettier-ignore
    if (!debug && supabase) {
      const { data: blackListData, error: blackListError } = await supabase.from("BlackList").select("*");
      if (blackListError) {
        throw blackListError;
      }
  
      // extract ids from BlackList data for comparison
      // prettier-ignore
      const blackListIds = blackListData.map((blackListItem: { location_id: string }) => blackListItem.location_id);
  
      // Filter 'allData' to exclude the data present in 'BlackList'
      allData = allData.filter((item) => !blackListIds.includes(item.id));
  
      // fetch data from the 'UserAdded' table from Supabase
      // prettier-ignore
      const { data: userAddedData, error: userAddedError } = await supabase.from("UserAdded").select("*");
      if (userAddedError) {
        throw userAddedError;
      }
  
      // map 'UserAdded' data to the correct format and add it to 'allData'
      const userAddedSpots: MarkerData[] = userAddedData.map(
        (item: UserAddedMarkerData) => ({
          id: item.site_id,
          date_added: formatDate(item.created_at),
          rack_type: item.selectedOption,
          x: item.x_coord,
          y: item.y_coord,
          favorite: false,
          type: "userAdded",
          author: item.username || item.email,
        })
      );
  
      allData = [...allData, ...userAddedSpots];
    }

    const endTotal = window.performance.now();
    console.log(`
      Total time: ${(endTotal - startTotal) / 1000}
      Rack time: ${(startSign - startRack) / 1000}
      Sign time: ${(endSign - startSign) / 1000}
    `);
    // console.log(allData);
    return allData.length > 0 ? allData : null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }
}

export default getCoordinates;
