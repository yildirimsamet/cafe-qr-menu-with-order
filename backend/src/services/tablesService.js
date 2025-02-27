import * as tablesRepository from '../repositories/tablesRepository.js'
import slugify from "slugify"

export const getTables = async () => {
    try {
        const results = await tablesRepository.getAllTables()
        const tables = {}
        
        results.forEach(row => {
            if (!tables[row.table_name]) {
                tables[row.table_name] = {
                    table_name: row.table_name,
                    items: [],
                    order_id: row.order_id,
                    table_slug: row.table_slug,
                }
            }

            if (row.item_name && row.item_size) {
                const existingItem = tables[row.table_name].items.find(
                    item => item.item_name === row.item_name && item.item_size === row.item_size
                )

                if (existingItem) {
                    existingItem.item_quantity += row.item_quantity
                } else {
                    tables[row.table_name].items.push({
                        item_name: row.item_name,
                        item_size: row.item_size,
                        item_quantity: row.item_quantity,
                        item_price: row.item_price
                    })
                }
            }
        })

        const formattedData = Object.values(tables)
        return formattedData
    } catch (error) {
        throw new Error("Failed to fetch tables")
    }
}

export const getTable = async (slug) => {
    try {
        const table = await tablesRepository.getTableBySlug(slug)
        return table
    } catch (error) {
        throw new Error("Failed to fetch table")
    }
}

export const addTable = async ({ name }) => {
    try {
        const slug = slugify(name, {
            lower: true,
            remove: /[*+~.()'"!:@]/g
        })

        const result = await tablesRepository.createTable({ name, slug })
        return result
    } catch (error) {
        throw error
    }
}

export const deleteTable = async ({ slug }) => {
    try {
        const result = await tablesRepository.deleteTable(slug)
        return result
    } catch (error) {
        throw error
    }
}