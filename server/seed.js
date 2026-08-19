// Populates the products table with the same placeholder products the
// frontend currently has hardcoded in src/data/products.js. Run once with
// `npm run seed`, and again any time you want to reset/update the catalog.
import { pool } from './db.js'

const products = [
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
    thumbnails: ['https://placehold.co/100x70/f8bbd0/c2185b?text=Thumb1'],
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
]

async function seed() {
  const client = await pool.connect()
  try {
    for (const p of products) {
      await client.query(
        `insert into products (id, name, price, style, image, thumbnails, description, sizes)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (id) do update set
           name = excluded.name,
           price = excluded.price,
           style = excluded.style,
           image = excluded.image,
           thumbnails = excluded.thumbnails,
           description = excluded.description,
           sizes = excluded.sizes`,
        [p.id, p.name, p.price, p.style, p.image, p.thumbnails, p.description, p.sizes]
      )
      console.log(`Seeded: ${p.name}`)
    }
    console.log(`Done. ${products.length} products seeded.`)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
