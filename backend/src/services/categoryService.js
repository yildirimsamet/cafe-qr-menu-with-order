import * as categoryRepository from "../repositories/categoryRepository.js"

export const getCategories = async () => {
    try {
        const categories = await categoryRepository.getAllCategories()
        return categories
    } catch (error) {
        throw new Error("Failed to fetch categories")
    }
}

export const editCategory = async ({ id, name }) => {
    try {
        const existingCategory = await categoryRepository.getCategoryByName(name)
        
        if (existingCategory && existingCategory.id !== parseInt(id)) {
            throw new Error("Category name already exists")
        }

        const result = await categoryRepository.updateCategory({ id, name })
        return result;
    } catch (error) {
        throw error
    }
}

export const addCategory = async ({ name }) => {
    try {
        const existingCategory = await categoryRepository.getCategoryByName(name)
        
        if (existingCategory) {
            throw new Error("Category already exists")
        }

        const id = await categoryRepository.createCategory({ name })
        return !!id
    } catch (error) {
        throw error
    }
}

export const deleteCategory = async ({ id }) => {
    try {
        const category = await categoryRepository.getCategoryById(id)
        
        if (!category) {
            throw new Error("Category not found")
        }

        const result = await categoryRepository.deleteCategory({ id })
        return result
    } catch (error) {
        throw error
    }
}