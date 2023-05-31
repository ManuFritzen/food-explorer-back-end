exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.text("category").notNullable();
    table.decimal("proce", 14,2).notNullable();
    table.string("image");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
}); 

exports.down = knex => knex.schema.dropTable("dishes");
