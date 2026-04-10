export interface OdpLocation {
  name: string;
  lat: number;
  lng: number;
}

export const DUMMY_OLT_ODP_LOCATIONS: Record<string, OdpLocation[]> = {
  "olt-1": [
    {
      "name": "ODP-CND-01-01",
      "lat": -6.291500,
      "lng": 106.854000
    },
    {
      "name": "ODP-CND-01-02",
      "lat": -6.292500,
      "lng": 106.856500
    },
    {
      "name": "ODP-CND-01-03",
      "lat": -6.294000,
      "lng": 106.855000
    },
    {
      "name": "ODP-CND-01-04",
      "lat": -6.290500,
      "lng": 106.857500
    },
    {
      "name": "ODP-CND-01-05",
      "lat": -6.293500,
      "lng": 106.853000
    }
  ],
  "olt-pandeglang-1": [
    {
      "name": "ODP-LBN-42260-30-001",
      "lat": -6.38833,
      "lng": 105.83925
    },
    {
      "name": "ODP-LBN-42264-30-010",
      "lat": -6.38916,
      "lng": 105.83778
    },
    {
      "name": "ODP-LBN-42264-30-021",
      "lat": -6.38661,
      "lng": 105.83756
    },
    {
      "name": "ODP-LBN-42264-30-028",
      "lat": -6.38617,
      "lng": 105.84033
    },
    {
      "name": "ODP-LBN-42265-30-017",
      "lat": -6.39086,
      "lng": 105.83911
    }
  ]
};
