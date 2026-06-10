const User = require("../models/User");
const Result = require("../models/Result");
const Violation = require("../models/Violation");

exports.dashboard = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalResults =
      await Result.countDocuments();

    const totalViolations =
      await Violation.countDocuments();

    res.json({
      totalUsers,
      totalResults,
      totalViolations
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getUsers = async (req, res) => {
  const users =
    await User.find().select("-password");

  res.json(users);
};

exports.getResults = async (req, res) => {
  const results =
    await Result.find()
      .populate("userId");

  res.json(results);
};

exports.getViolations = async (req, res) => {
  try {
    const violations = await Violation.find();

    console.log("Violations:", violations.length);

    return res.status(200).json(violations);
  } catch (error) {
    console.error("Violation Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};
