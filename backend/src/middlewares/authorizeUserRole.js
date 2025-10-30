import User from "../schema/user.js";

export const authorizeUserRole = (req, res, next) => {
  const assignedUserId = req.body.assignedTo;

  User.findById(assignedUserId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "user") {
        next();
      } else {
        return res
          .status(403)
          .json({
            message: "Forbidden: you can not assign task to admin or manager",
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
export const authorizeUserRole1 = (req, res, next) => {
  const userId = req.user._id;
  const requestedUserId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin" || user.role === "manager") {
        return next();
      }

      if (userId.toString() === requestedUserId) {
        return next();
      }

      return res.status(403).json({
        message: "Forbidden: you can only view your own tasks",
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

export default authorizeUserRole;
