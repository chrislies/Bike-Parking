# Bike Parking

[Bike Parking](https://bike-parking.vercel.app/) is a community-driven interactive web map that locates accessible parking spots (bike racks and street signs) for bikes and scooters. Accessible parking spots are pinned on the map along with any community reports they may have received from users within the app.

## Mission

Bike Parking's mission is to make the bike/scooter commuting experience more convenient by reducing the hassle of trying to find a good spot to lock your vehicle.

## Features

- Save a spot
- Report a spot
- View reports for a spot
- Navigational and routing to a spot
- Request to add a new spot
- Request to delete a spot

## Featured Technologies

- Interactive map using [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/)
- Real-time data from [NYC Open Data](https://opendata.cityofnewyork.us/)
- [Next.js](https://nextjs.org/) frontend framework
- [Supabase](https://supabase.com/) backend ORM
- Deployed and hosted on [Vercel](https://vercel.com/)

## Development

1. Install [Node.js 18.17](https://nodejs.org/en/download/) or later
2. Clone repository and download dependencies

```
git clone https://github.com/chrislies/Bike-Parking.git && cd Bike-Parking/bike-parking-app/ && npm install
```

3. Create a [Supabase](https://supabase.com/) project and obtain API keys
4. Create a `.env` file in the `bike-parking-app` directory and paste your `‘NEXT_PUBLIC_SUPABASE_URL’` and `‘NEXT_PUBLIC_SUPABASE_ANON_KEY’` keys
5. Start local development server

```
npm run dev
```
