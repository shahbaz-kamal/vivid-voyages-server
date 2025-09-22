import { Booking } from "../booking/booking.model";
import { Tour, TourType } from "../tour/tour.model";
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
  //   await Tour.updateMany(
  //     // only update where touttype and divisions are stored as string

  //     {
  //       $or: [
  //         { tourType: { $type: "string" } },
  //         { division: { $type: "string" } },
  //       ],
  //     },
  //     [
  //       {
  //         $set: {
  //           tourType: { $toObjectId: "$tourType" },
  //           division: { $toObjectId: "$division" },
  //         },
  //       },
  //     ]
  //   );
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
    //stage 2: unwind (make array to objects)
    {
      $unwind: "$type",
    },
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const averageTourCostPromise = Tour.aggregate([
    //stage-1: do the cost from, do sum and average the sum
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    //stage 1: coonect divisiondb with tour
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    //stage 22: unwind
    {
      $unwind: "$division",
    },
    //stage 3 group by name
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestTourBookedPromise = await Booking.aggregate([
    //stage 1:group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    //stage 2: sort bppking count

    {
      $sort: { bookingCount: -1 },
    },
    { $limit: 5 },
    //stage 4:lookup
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    //step 5:unwind stage;
    { $unwind: "$tour" },
    //stage 6: project
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourTypes,
    averageTourCost,
    totalTourByDivision,
    totalHighestTourBooked,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypesPromise,
    averageTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestTourBookedPromise,
  ]);

  return {
    totalTour,
    totalTourByTourTypes,
    averageTourCost,
    totalTourByDivision,
    totalHighestTourBooked,
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
