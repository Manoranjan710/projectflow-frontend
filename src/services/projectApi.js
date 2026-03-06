import axiosClient from "@/api/axiosClient";

export const getProjects = async (params) => {
    const response = await axiosClient.get("/projects", {
        params
    });
    return response.data;
}