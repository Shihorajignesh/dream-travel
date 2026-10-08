const img = (id, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
const D = (slug, name, country, region, tripType, rating, reviews, experiences, from, days, popularity, blurb, photo) =>
  ({ id: slug, slug, name, country, region, tripType, rating, reviews, experiences, from, days, popularity, blurb, image: img(photo) });

export const destinations = [
  D('bali', 'Bali', 'Indonesia', 'Asia', 'Beach', 4.9, 2841, 128, 899, 7, 98, 'Rice terraces, surf breaks, and temple sunrises on the Island of the Gods.', 'photo-1537996194471-e657df975ab4'),
  D('santorini', 'Santorini', 'Greece', 'Europe', 'Romantic', 4.8, 1932, 74, 1190, 5, 94, 'Whitewashed villages above a flooded volcanic caldera, best seen at sunset.', 'photo-1570077188670-e3a8d69ac5ff'),
  D('dubai', 'Dubai', 'UAE', 'Middle East', 'Luxury', 4.7, 2210, 96, 1050, 5, 90, 'Record-breaking skylines, desert safaris, and some of the best dining anywhere.', 'photo-1512453979798-5ea266f8880c'),
  D('paris', 'Paris', 'France', 'Europe', 'City', 4.8, 3377, 152, 980, 4, 97, 'Café mornings, world-class museums, and evenings along the Seine.', 'photo-1502602898657-3e91760cbb34'),
  D('switzerland', 'Swiss Alps', 'Switzerland', 'Europe', 'Mountain', 4.9, 1486, 61, 1480, 7, 88, 'Panoramic train rides, alpine lakes, and trails beneath the Matterhorn.', 'photo-1531366936337-7c912a4589a7'),
  D('tokyo', 'Tokyo', 'Japan', 'Asia', 'City', 4.8, 2764, 183, 1120, 8, 95, 'Neon districts, quiet shrines, and the most exacting food culture on earth.', 'photo-1540959733332-eab4deabeeaf'),
  D('maldives', 'Maldives', 'Maldives', 'Asia', 'Luxury', 4.9, 1650, 48, 1890, 6, 92, 'Overwater villas, house reefs, and lagoons that glow turquoise at noon.', 'photo-1514282401047-d79a71a590e8'),
  D('amalfi-coast', 'Amalfi Coast', 'Italy', 'Europe', 'Romantic', 4.8, 1204, 57, 1340, 6, 86, 'Cliffside lemon groves, ferry hops between pastel towns, and long seafood lunches.', 'photo-1533105079780-92b9be482077'),
  D('iceland', 'Iceland', 'Iceland', 'Europe', 'Adventure', 4.8, 1377, 69, 1560, 8, 84, 'Glaciers, geothermal lagoons, and northern lights over black-sand coastlines.', 'photo-1504829857797-ddff29c27927'),
  D('new-york', 'New York', 'USA', 'North America', 'City', 4.6, 3120, 210, 1090, 4, 93, 'Broadway nights, borough-by-borough food crawls, and skyline views from every angle.', 'photo-1496442226666-8d4d0e62e6e9'),
  D('cape-town', 'Cape Town', 'South Africa', 'Africa', 'Adventure', 4.8, 1098, 82, 940, 9, 80, 'Table Mountain hikes, Cape Winelands tastings, and penguins on Boulders Beach.', 'photo-1580060839134-75a5edca2e99'),
  D('kyoto', 'Kyoto', 'Japan', 'Asia', 'Cultural', 4.9, 1876, 91, 1060, 5, 89, 'Thousand-gate shrines, tea houses, and bamboo groves in Japan\'s old capital.', 'photo-1493976040374-85c8e12f0c0e'),
];
export const HERO_IMAGE = img('photo-1507525428034-b723cf961d3e', 2000);
