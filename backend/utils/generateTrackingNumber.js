import Courier from "../models/Courier.js";

const generateTrackingNumber = async () => {

    const year = new Date().getFullYear();

    const count = await Courier.countDocuments();

    const number = String(count + 1).padStart(6, "0");

    return `CTS${year}${number}`;

};

export default generateTrackingNumber;