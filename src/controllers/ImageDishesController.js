const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class ImageDishesController {
    async update(req, res){
        const dishes_id = req.params.id;
        const imageFileName = req.file.filename;

        const diskStorage = new DiskStorage();

        const dish = await knex("dishes").where({ id: dishes_id }).first();

        if(!dish){
            throw new AppError("O prato que você está tentando atualizar não existe", 401);
        }

        if(dish.image){
            await diskStorage.deleteFile(dish.image);
        }

        const filename = await diskStorage.saveFile(imageFileName);
        dish.image = filename;

        await knex("dishes").update(dish).where({id: dishes_id});

        return res.json(dish);
    }

}

module.exports = ImageDishesController;