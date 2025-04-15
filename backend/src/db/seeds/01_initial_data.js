import bcrypt from 'bcrypt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('order_items').del();
  await knex('order_groups').del();
  await knex('orders').del();
  await knex('notifications').del();
  await knex('settings').del();
  await knex('item_sizes').del();
  await knex('items').del();
  await knex('categories').del();
  await knex('sizes').del();
  await knex('tables').del();
  await knex('users').del();

  // Kategorileri ekle
  await knex('categories').insert([
    { name: 'Kahve' },
    { name: 'Pizza' },
    { name: 'Tatlilar' },
    { name: 'Bira' },
  ]);

  // Boyutları ekle
  await knex('sizes').insert([
    { id: 1, name: 'Tek Boyut' },
    { id: 2, name: 'Small' },
    { id: 3, name: 'Medium' },
    { id: 4, name: 'Large' },
    { id: 5, name: '33cl' },
    { id: 6, name: '50cl' },
  ]);

  // Ürünleri ekle
  const [kahveCat, pizzaCat, tatliCat, biraCat] = await knex('categories')
    .select('id')
    .orderBy('id');

  await knex('items').insert([
    {
      id: 1,
      name: 'Pepperoni Pizza',
      description: 'Lezzetli pepperoni pizza',
      image: 'pizza1.avif',
      category_id: pizzaCat.id,
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      description: 'Klasik margherita pizza',
      image: 'pizza2.webp',
      category_id: pizzaCat.id,
    },
    {
      id: 3,
      name: 'Türk Kahvesi',
      description: 'Sıcak türk hahvesi kahve',
      image: 'turkkahvesi.webp',
      category_id: kahveCat.id,
    },
    {
      id: 4,
      name: 'Cheese Cake Limon',
      description: 'Limonlu cheesecake',
      image: 'limon.jpeg',
      category_id: tatliCat.id,
    },
    {
      id: 5,
      name: 'Cheese Cake Bögürtlen',
      description: 'Böğürtlenli cheesecake',
      image: 'bogurtlen.jpg',
      category_id: tatliCat.id,
    },
    {
      id: 6,
      name: 'Tuborg Gold',
      description: 'Tuborg Gold Bira',
      image: 'tuborg.webp',
      category_id: biraCat.id,
    },
    {
      id: 7,
      name: 'Efes Pilsen ',
      description: 'Efes Bira',
      image: 'efes.webp',
      category_id: biraCat.id,
    },
  ]);

  // Ürün boyutlarını ve fiyatlarını ekle
  await knex('item_sizes').insert([
    { item_id: 1, size_id: 2, price: 15.99 },
    { item_id: 1, size_id: 3, price: 16.99 },
    { item_id: 1, size_id: 4, price: 17.99 },
    { item_id: 2, size_id: 2, price: 12.99 },
    { item_id: 2, size_id: 3, price: 13.99 },
    { item_id: 2, size_id: 4, price: 14.99 },
    { item_id: 3, size_id: 1, price: 9.99 },
    { item_id: 4, size_id: 1, price: 9.99 },
    { item_id: 5, size_id: 1, price: 9.99 },
    { item_id: 6, size_id: 5, price: 5.99 },
    { item_id: 6, size_id: 6, price: 6.99 },
    { item_id: 7, size_id: 5, price: 5.99 },
    { item_id: 7, size_id: 6, price: 6.99 },
  ]);

  // Masaları ekle
  await knex('tables').insert([
    { name: 'Masa 1', slug: 'masa-1' },
    { name: 'Masa 2', slug: 'masa-2' },
  ]);

  // Ayarları ekle
  await knex('settings').insert([
    { key: 'logo', value: 'default_logo.png' },
    {
      key: 'colors',
      value: JSON.stringify({
        'bg-1': '#1b4351',
        'bg-1-dark': '#133642',
        'bg-1-darker': '#0d2731',
        'bg-2': '#b96024',
        'bg-2-dark': '#bf6f39',
        'bg-2-darker': '#a3673c',
        'bg-3': '#d7d7d7',
        'bg-4': '#efefef',
        'bg-5': '#e5e5e5',
        'text-1': '#336475',
        'text-1-dark': '#3a5258',
        'text-1-darker': '#46524f',
        'text-2': '#b96024',
        'text-2-dark': '#bf6f39',
        'text-2-darker': '#a3673c',
        'text-3': '#ECF2F3',
        'text-4': '#cbcbcb',
        'text-accent-1': '#e5ac5c',
        'text-accent-2': '#D4A96A',
        'border-1': '#4e8a9e',
        'border-2': '#8A4B2D',
        'border-neutral': '#7D8E95',
        'accent-1': '#e5ac5c',
        'accent-2': '#D4A96A',
        success: '#379b52',
        danger: '#d32f2f',
        warning: '#c59238',
      }),
    },
    { key: 'address', value: '1234sk. no:1 Buca/Izmir' },
    { key: 'phoneNumber', value: '0512 345 67 89' },
    { key: 'companyName', value: 'XYZ Cafe' },
  ]);


  await knex('users').insert({
    username: 'superadmin',
    password: '$2b$10$dU6x1dNOu9ORbBRFrkLZn.5yj4HpREra7Ezgd7qGQqaq/XuqrEjXu',
    role: 'superadmin',
  });
}
