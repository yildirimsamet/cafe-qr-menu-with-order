import * as menuRepository from "../repositories/menuRepository.js";

export const getMenu = async () => {
    try {
        const menu = await menuRepository.getMenu();
        return menu;
    } catch (error) {
        throw new Error("Failed to fetch menu");
    }
};
