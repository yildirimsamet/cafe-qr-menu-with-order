import * as itemsRepository from '../repositories/itemsRepository.js'

export const getItems = async () => {
    try {
        const results = await itemsRepository.getAllItems()
        const editedResults = results.map((result) => ({
            ...result,
            items: result.items.filter((item) => 
                item.sizes !== null || (item.sizes && item.sizes.length > 0)
            ),
        }))
        return editedResults
    } catch (error) {
        throw new Error("Failed to fetch items")
    }
}

export const addItem = async ({ name, description, category, image, sizes }) => {
    try {
        const addItemResult = await itemsRepository.createItem({ 
            name, 
            description, 
            category_id: category, 
            image 
        })

        await itemsRepository.addItemSizes(addItemResult.insertId, sizes)
        return addItemResult
    } catch (error) {
        throw error
    }
}

export const deleteItem = async ({ id }) => {
    try {
        const result = await itemsRepository.deleteItem(id)
        if (result.affectedRows === 0) {
            throw new Error("Item not found")
        }
        return result
    } catch (error) {
        throw error
    }
}

export const editItem = async ({ id, name, description, category, image, sizes }) => {
    try {
        const result = await itemsRepository.editItem({ 
            id, 
            name, 
            description, 
            category_id: category, 
            image 
        })

        if (result.affectedRows === 0) {
            throw new Error("Item not found")
        }

        await itemsRepository.deleteItemSizes(id)
        await itemsRepository.addItemSizes(id, sizes)

        return result
    } catch (error) {
        throw error
    }
}