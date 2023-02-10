const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
    async create(request, response){
        const { name, email, password } = request.body;

        const database = await sqliteConnection();
        const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

        if(checkUserExists) {
            throw new AppError("Este email já está caastrado.");
        }

        const hashedPassword = await hash(password, 8);

        await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        return response.status(201).json();
    }

    async update(request, respoonse) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELET * FROM users WHERE id = (?)", [id]);

        if(!user){
            throw new AppError("Usuário não existe!");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este e-mail ja está cadastrado.");
        }
        
        user.name = name;
        user.email = email;

        if(password && !old_password){
            throw new AppError("Informe a senha antiga para poder definir a senha nova.");
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);
            
            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere!");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            passwors = ?,
            updated_at = ?
            WHERE id = ?`,
            [user.name, user.email, user.password, new Date(), id]
        );

        return response.status(200).json();
    }
};

module.exports = UsersController;