import * as sizeRepository from '../repositories/sizeRepository.js'

export const getSizes = async () => {
    try {
        const sizes = await sizeRepository.getAllSizes()
        return sizes
    } catch (error) {
        throw new Error("Failed to fetch sizes")
    }
}

export const addSize = async ({ name }) => {
    try {
        const existingSize = await sizeRepository.getSizeByName(name)

        if (existingSize) {
            throw new Error("Size already exists")
        }

        const id = await sizeRepository.createSize({ name })
        return { id, name }
    } catch (error) {
        throw error
    }
}

export const deleteSize = async ({ id }) => {
    try {
        const size = await sizeRepository.getSizeById(id)

        if (!size) {
            throw new Error("Size not found")
        }

        const result = await sizeRepository.deleteSize({ id })
        return result
    } catch (error) {
        throw error
    }
}

export const editSize = async ({ id, name }) => {
    try {
        const existingSize = await sizeRepository.getSizeByName(name)

        if (existingSize && existingSize.id !== parseInt(id)) {
            throw new Error("Size name already exists")
        }

        const result = await sizeRepository.editSize({ id, name })
        return result
    } catch (error) {
        throw error
    }
}