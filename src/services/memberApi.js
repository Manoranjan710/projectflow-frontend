import axiosClient from "@/api/axiosClient";

export const getAvailableUsers = async (projectId) => {

  const res = await axiosClient.get(
    `/projects/${projectId}/available-users`
  );

  return res.data;
};

export const addMember = async (projectId, userId) => {

  const res = await axiosClient.post(
    `/projects/${projectId}/members`,
    { userId }
  );

  return res.data;
};