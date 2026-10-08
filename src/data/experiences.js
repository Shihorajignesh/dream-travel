const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;
export const experiences = [
  { id: 'beach', title: 'Beach escapes', type: 'Beach', category: 'Beach', text: 'Powder sand, house reefs, and sunset swims at the world\'s best shorelines.', image: img('photo-1507525428034-b723cf961d3e') },
  { id: 'mountain', title: 'Mountain adventures', type: 'Mountain', category: 'Adventure', text: 'Alpine trails, glacier walks, and scenic trains with summit views.', image: img('photo-1531366936337-7c912a4589a7') },
  { id: 'city', title: 'City breaks', type: 'City', category: 'Budget', text: 'Compact, food-led stays in cities built for wandering.', image: img('photo-1540959733332-eab4deabeeaf') },
  { id: 'luxury', title: 'Luxury retreats', type: 'Luxury', category: 'Luxury', text: 'Private villas, personal hosts, and rooms worth staying in for.', image: img('photo-1514282401047-d79a71a590e8') },
  { id: 'cultural', title: 'Cultural journeys', type: 'Cultural', category: 'Cultural', text: 'Temples, tea houses, and craft workshops guided by local experts.', image: img('photo-1493976040374-85c8e12f0c0e') },
  { id: 'romantic', title: 'Romantic getaways', type: 'Romantic', category: 'Honeymoon', text: 'Candlelit terraces, private sailing, and slow mornings for two.', image: img('photo-1570077188670-e3a8d69ac5ff') },
];
