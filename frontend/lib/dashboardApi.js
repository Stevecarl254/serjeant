import axiosInstance from "./axiosInstance";

export async function getDashboardStats() {
  const res = await axiosInstance.get("/adminDashboard/stats");
  return res.data.data;
}
