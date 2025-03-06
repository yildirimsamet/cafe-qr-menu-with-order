import * as settingsRepository from '../repositories/settingsRepository.js'

export const updateColors = async (colors) => {
    try {
        const results = await settingsRepository.updateColors(colors)
        return results
    } catch (error) {
        throw error
    }
}

export const getSettings = async () => {
    try {
        const settings = await settingsRepository.getSettings();

        return settings.reduce((acc, setting) => {
            if (setting.value.startsWith("{")) {
                acc[setting.key] = JSON.parse(setting.value);
            } else {
                acc[setting.key] = setting.value;
            }

            return acc;
        }, {});
    } catch (error) {
        throw new Error("Failed to fetch settings")
    }
}

export const updateLogoImage = async (logo) => {
    try {
        const results = await settingsRepository.updateLogoImage(logo)
        return results
    } catch (error) {
        throw error
    }
}

export const updateContactInfo = async (contactInfo) => {
    try {
        const results = await settingsRepository.updateContactInfo(contactInfo)
        return results
    } catch (error) {
        throw error
    }
}