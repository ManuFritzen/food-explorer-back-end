const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class DishesController{
    async getAll(request, response) {
        const dishes = await knex("dishes").select("*");
        return response.json(dishes);
    }
    async create(request, response) {
        const {name, image, description, category, price, ingredients} = request.body;

        const checkDishAlreadyExistInDatabase = await knex("dishes").where({name}).first();
    
        if(checkDishAlreadyExistInDatabase){
            throw new AppError("Este prato já existe")
        } 
        
        const dish_id = await knex("dishes").insert({
            image,
            name,
            description,
            category,
            price
        });
        

        const ingredientsInsert = ingredients.map(ingredient => {
            return{
                name: ingredient,
                dish_id
            }
        });
    
        await knex("ingredients").insert(ingredientsInsert)
    
        return response.status(201).json()
    
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.status(204).json();
    }

    async update(request, response){
        const { name, description, category, image, price, ingredients } = request.body;
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();

        if(!dish){
            throw new AppError("O prato que você está tentando atualizar não existe")
        }

        dish.name = name ?? dish.name;
        dish.description = description ?? dish.description;
        dish.category = category ?? dish.category;
        dish.image = image ?? dish.image;
        dish.price = price ?? dish.price;    

        await knex("dishes").where({ id }).update(dish)
        await knex("dishes").where({ id }).update("updated_at", knex.fn.now())

        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert
        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                dish_id: dish.id,
                name: ingredients
            }
        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map(ingredient => {
                return {
                    dish_id: dish.id,
                    name : ingredient
                }
            })          
            await knex("ingredients").where({ dish_id: id}).delete()
            await knex("ingredients").where({ dish_id: id}).insert(ingredientsInsert)
        }
        return response.status(202).json('Prato atualizado com sucesso')
    }
    async getById(request, response) {
        const { id } = request.params;
    
        const dish = await knex("dishes").where({ id }).first();
    
        if (!dish) {
          return response.status(404).json({ error: "Prato não encontrado" });
        }
    
        return response.json(dish);
      }
    
}

module.exports = DishesController;