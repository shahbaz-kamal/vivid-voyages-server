import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 7);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    //stage 1: grouping users by role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();
  const totalTourByTourTypesPromise = Tour.aggregate([
    //stage 1: connect tourTypes db with tour===>lookup

    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
  ]);
  const [totalTour, totalTourByTourTypes] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypesPromise,
  ]);

  return {
    totalTour,
    totalTourByTourTypes,
  };
};

const getBookingStats = async () => {
  console.log("getBooking STats");
};

const getPaymentStats = async () => {
  console.log("getPaymentStats ");
};

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
