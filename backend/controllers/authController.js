import { loginUser } from "../services/authService.js";

/**
 * @desc Login (Admin & Courier Partner)
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Call service
    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};