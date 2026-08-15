export const STYLES = ['French Tip', 'Glitter', 'Pastel', 'The Basics', 'Seasonal']

export const products = [
  {
    id: 'elegant-french-tip',
    name: 'Elegant French Tip Press-Ons',
    price: 24.99,
    style: 'French Tip',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=French+Tip',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb2',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb3',
    ],
    description:
      'Achieve a timeless and sophisticated look with our Elegant French Tip Press-Ons. These high-quality, reusable nails feature a classic white tip on a natural base, perfect for any occasion. Made from durable, non-toxic materials, they are easy to apply and remove, providing a salon-quality manicure in minutes. Each set includes 24 nails in various sizes, a nail file, cuticle stick, and adhesive tabs.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'glamorous-glitter',
    name: 'Glamorous Glitter Press-Ons',
    price: 29.99,
    style: 'Glitter',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=Glitter',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb2',
    ],
    description:
      'Turn heads with our Glamorous Glitter Press-Ons. A full-coverage sparkle finish over a durable base, perfect for parties and special occasions. Each set includes 24 nails, adhesive tabs, a nail file, and a cuticle stick.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream Press-Ons',
    price: 19.99,
    style: 'Pastel',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=Pastel',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb2',
    ],
    description:
      'Soft pastel shades for an everyday, effortless manicure. Lightweight and comfortable for all-day wear. Each set includes 24 nails, adhesive tabs, a nail file, and a cuticle stick.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'the-basics-nude',
    name: 'The Basics — Nude',
    price: 14.99,
    style: 'The Basics',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=Nude+Basics',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
    ],
    description:
      'A clean, versatile nude that goes with everything. Our most affordable set, without cutting corners on quality. Each set includes 24 nails, adhesive tabs, a nail file, and a cuticle stick.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest Press-Ons',
    price: 27.99,
    style: 'Seasonal',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=Autumn',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb2',
    ],
    description:
      'Warm terracotta and burnt-orange tones inspired by fall. A limited seasonal set — each includes 24 nails, adhesive tabs, a nail file, and a cuticle stick.',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 'summer-vibes',
    name: 'Summer Vibes Press-Ons',
    price: 27.99,
    style: 'Seasonal',
    image: 'https://placehold.co/600x400/f8bbd0/c2185b?text=Summer',
    thumbnails: [
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1',
      'https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb2',
    ],
    description:
      'Bright coral and citrus tones for beach days and long evenings out. Each set includes 24 nails, adhesive tabs, a nail file, and a cuticle stick.',
    sizes: ['S', 'M', 'L'],
  },
  // Add more products here as plain objects — each one automatically gets
  // a homepage card and a working /product/:id page. No new HTML file needed.
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}
