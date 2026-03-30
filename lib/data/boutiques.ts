// Static boutique list — used as fallback when Supabase returns no results.
// To make Supabase the primary source, run supabase/seed.sql in your SQL editor.

export interface StaticBoutique {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  lat: number
  lng: number
}

export const STATIC_BOUTIQUES: StaticBoutique[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    name: 'Top 10 Prom Marietta',
    slug: 'marietta',
    address: '1255 Johnson Ferry Rd Suite 804',
    city: 'Marietta',
    state: 'GA',
    zip: '30068',
    phone: '(770) 977-1010',
    lat: 33.9526,
    lng: -84.4496,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    name: 'Top 10 Prom Alpharetta',
    slug: 'alpharetta',
    address: '5965 North Point Pkwy Suite 119',
    city: 'Alpharetta',
    state: 'GA',
    zip: '30022',
    phone: '(770) 664-1010',
    lat: 34.0754,
    lng: -84.2941,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    name: 'Top 10 Prom Buckhead',
    slug: 'buckhead',
    address: '3393 Peachtree Rd NE Suite 3040',
    city: 'Atlanta',
    state: 'GA',
    zip: '30326',
    phone: '(404) 467-1010',
    lat: 33.8490,
    lng: -84.3640,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    name: 'Top 10 Prom Kennesaw',
    slug: 'kennesaw',
    address: '2971 Cobb Pkwy NW Suite 101',
    city: 'Kennesaw',
    state: 'GA',
    zip: '30152',
    phone: '(770) 420-1010',
    lat: 34.0234,
    lng: -84.6154,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000005',
    name: 'Top 10 Prom Smyrna',
    slug: 'smyrna',
    address: '4500 Akers Mill Rd SE Suite 224',
    city: 'Smyrna',
    state: 'GA',
    zip: '30080',
    phone: '(770) 433-1010',
    lat: 33.8737,
    lng: -84.5144,
  },
]
