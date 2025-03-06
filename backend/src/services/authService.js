import * as authRepository from "../repositories/authRepository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async ({ username, password }) => {
    const user = await authRepository.findUserByUsername(username);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '999999d',
    });

    return { token, user: { id: user.id, role: user.role, username: user.username } };
};

export const register = async ({ username, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await authRepository.createUser({ username, password: hashedPassword, role });

    return { id, username, role };
};

export const getUser = async ({ token }) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await authRepository.findUserByUsername(decoded.username);

        if (!user) {
            throw new Error("Invalid token");
        }

        return user;
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const getUserById = async (id) => {
    const user = await authRepository.getUserById(id);
    return user;
}

export const updateUser = async (id, { username, password, role }) => {
    return await authRepository.updateUser(id, { username, password, role });
};

export const deleteUser = async (id) => {
    return await authRepository.deleteUser(id);
};
