import axiosClient from "@/api/axiosClient";

export const getProjects = async (params) => {
    const response = await axiosClient.get("/projects", {
        params
    });
    return response.data;
}

export const createProject = async (data) => {
  const response = await axiosClient.post("/projects", data);
  return response.data;
};

export const getProjectDetails = async (projectId) => {

  const res = await axiosClient.get(`/projects/${projectId}`);

  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await axiosClient.delete(`/projects/${projectId}`);
  return res.data;
};

export const patchProject = async (projectId, data) => {
  const res = await axiosClient.patch(`/projects/${projectId}`, data);
  return res.data;
};
