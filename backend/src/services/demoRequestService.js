import * as demoRequestRepository from "../repositories/demoRequestRepository.js";

export const createDemoRequest = async (data) => {
    const { business, email, phone, message } = data;

    if (!phone) {
        throw new Error("Phone number is required");
    }

    try {
        const id = await demoRequestRepository.createDemoRequest({
            business_name: business,
            email,
            phone,
            message
        });
        return { id, ...data };
    } catch (error) {
        console.error("Error creating demo request in service:", error);
        throw new Error("Failed to create demo request");
    }
};

export const getDemoRequests = async () => {
    try {
        const requests = await demoRequestRepository.getAllDemoRequests();
        return requests;
    } catch (error) {
        console.error("Error fetching demo requests in service:", error);
        throw new Error("Failed to fetch demo requests");
    }
};

export const deleteDemoRequest = async (id) => {
    try {
        const success = await demoRequestRepository.deleteDemoRequest(id);
        if (!success) {
            throw new Error("Demo request not found or could not be deleted");
        }
        return { success: true };
    } catch (error) {
        console.error("Error deleting demo request in service:", error);
        throw new Error("Failed to delete demo request");
    }
};
