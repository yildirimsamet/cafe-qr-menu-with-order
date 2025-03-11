import path from "path";
import fs from "fs";

export const deleteImage = async (imageName) => {
    try {
        const pathToFile = path.join(process.cwd(), 'public', 'assets', 'images', imageName);
        if (fs.existsSync(pathToFile)) {
            fs.unlinkSync(pathToFile);
        }
    } catch (error) {
        console.log(error)
    }
}