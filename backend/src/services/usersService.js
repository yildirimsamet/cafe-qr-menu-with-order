import * as usersRepository from '../repositories/usersRepository.js'

export const getUsers = async () => {
    const users = await usersRepository.getUsers();

    return users;
}

export const getUserById = async (id) => {
    const user = await usersRepository.getUserById(id);
    return user;
}

