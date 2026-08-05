import {
  createPartner,
  getPartners,
  deletePartner,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getPartnerById,
  updatePartner,
} from "../services/userService.js";

/**
 * @desc Create Courier Partner
 * @route POST /api/users/partners
 * @access Admin
 */
export const addPartner = async (req, res) => {
  try {
    const partner = await createPartner(req.body);

    res.status(201).json({
      success: true,
      message: "Courier partner created successfully.",
      partner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Partner by ID
 * @route GET /api/users/partners/:id
 * @access Admin
 */
export const getPartnerByIdHandler = async (req, res) => {
  try {
    const partner = await getPartnerById(req.params.id);

    res.status(200).json({
      success: true,
      partner,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Partner
 * @route PUT /api/users/partners/:id
 * @access Admin
 */
export const updatePartnerHandler = async (req, res) => {
  try {
    const partner = await updatePartner(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Partner updated successfully.",
      partner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get current user profile
 * @route GET /api/users/profile
 * @access Admin/Partner
 */
export const getProfileHandler = async (req, res) => {
  try {
    const profile = await getUserProfile(req.user._id);

    res.status(200).json({
      success: true,
      ...profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update current user profile
 * @route PUT /api/users/profile
 * @access Admin/Partner
 */
export const updateProfileHandler = async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Change current user password
 * @route PUT /api/users/change-password
 * @access Admin/Partner
 */
export const changePasswordHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    await changeUserPassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Courier Partners
 * @route GET /api/users/partners
 * @access Admin
 */
export const getAllPartners = async (req, res) => {
  try {
    const partners = await getPartners();

    res.status(200).json({
      success: true,
      count: partners.length,
      partners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deletePartnerHandler = async (req, res) => {
  try {
    await deletePartner(req.params.id);

    res.status(200).json({
      success: true,
      message: "Partner deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};