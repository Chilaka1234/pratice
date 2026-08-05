import { getDashboardStats } from "../services/dashboardService.js";

export const getDashboardStatsHandler = async (req, res) => {
    try {

        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            stats,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};