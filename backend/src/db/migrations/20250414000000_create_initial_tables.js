/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enum('role', ['waiter', 'admin', 'superadmin']).defaultTo('waiter');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.text('description');
    table.string('image', 255);
    table.integer('category_id').unsigned().notNullable();
    table.boolean('in_stock').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('category_id').references('id').inTable('categories').onDelete('RESTRICT');
  });

  await knex.schema.createTable('sizes', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
  });

  await knex.schema.createTable('item_sizes', (table) => {
    table.increments('id').primary();
    table.integer('item_id').unsigned().notNullable();
    table.integer('size_id').unsigned().notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('item_id').references('id').inTable('items').onDelete('CASCADE');
    table.foreign('size_id').references('id').inTable('sizes').onDelete('RESTRICT');
    table.unique(['item_id', 'size_id']);
  });

  await knex.schema.createTable('tables', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable().unique();
    table.string('slug', 255).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.string('table_slug', 255).notNullable();
    table.enum('status', ['active', 'done']).notNullable();
    table.timestamp('done_at').nullable().defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('order_groups', (table) => {
    table.increments('id').primary()
    table.integer('order_id').unsigned().notNullable();
    table.enum('status', ['waiting', 'send']).notNullable();
    table.text('note');
    table.string('updated_by', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
  });

  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary()
    table.integer('order_group_id').unsigned().notNullable();
    table.integer('item_id').unsigned().notNullable();
    table.integer('item_size_id').unsigned().nullable();
    table.integer('item_quantity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.foreign('order_group_id').references('id').inTable('order_groups').onDelete('CASCADE');
    table.check('?? > 0', ['item_quantity']);
  });

  await knex.schema.createTable('settings', (table) => {
    table.increments('id').primary();
    table.string('key', 255).notNullable().unique();
    table.specificType('value', 'LONGTEXT');
  });

  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.text('message');
    table.enum('type', ['message', 'call_waiter', 'bill_request']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('table_slug', 255).notNullable();
    table.foreign('table_slug').references('slug').inTable('tables').onDelete('CASCADE');
  });

  await knex.schema.createTable('demo_requests', (table) => {
    table.increments('id').primary();
    table.string('business_name', 255);
    table.string('email', 255);
    table.string('phone', 20).notNullable();
    table.text('message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('demo_requests');
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('order_groups');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('tables');
  await knex.schema.dropTableIfExists('item_sizes');
  await knex.schema.dropTableIfExists('sizes');
  await knex.schema.dropTableIfExists('items');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
}
