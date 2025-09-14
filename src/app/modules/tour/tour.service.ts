import { excludeField } from "../../constants";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constants";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }

  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`; // dhaka-division-2
  }

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTours = async (query: Record<string, string>) => {
  // const tourSearchableFields = ["title", "description", "location"];
  console.log("Query==>\n", query);

  console.log(query);
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const allTours = queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .pagination();
  // const meta = await queryBuilder.getMeta();

  const [data, meta] = await Promise.all([
    allTours.build(),
    queryBuilder.getMeta(),
  ]);
  // console.log("query Execute", queryExecute);
  return {
    meta,
    data,
  };
};

// const mygetAllToursOld = async (query: Record<string, string>) => {
//   // const tourSearchableFields = ["title", "description", "location"];
//   console.log("Query==>\n", query);
//   const filter = query;
//   console.log(query);
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const pageNumber = Number(query.pageNumber) || 1;
//   const limit = Number(query.limit) || 10;

//   //for field Filtering
//   const fields = query.fields?.split(",")?.join(" ") || "";

//   // const excludeField = ["searchTerm", "sort"];

//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }
//   console.log("filter===>\n", filter);
//   //searching
//   const searchObject = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   //pagination
//   const skip = (pageNumber - 1) * limit;

//   // const allTours = await Tour.find()
//   //   .find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(2)
//   //   .skip(skip)
//   //   .limit(limit);
//   const filterQuery = Tour.find(filter);
//   const searchQuery = filterQuery.find(searchObject);
//   const allTours = await searchQuery
//     .sort(sort)
//     .select(fields)
//     .skip(2)
//     .skip(skip)
//     .limit(limit);

//   const totalTours = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTours / limit);

//   const filteredTours = allTours.length;
//   const meta = {
//     total: totalTours,
//     noOfMatchedData: filteredTours,
//     pageNumber,
//     limit,
//     totalPage,
//   };
//   return {
//     meta,
//     data: allTours,
//   };
// };

// const getAllTours = async (query: Record<string, string>) => {

//     const queryBuilder = new QueryBuilder(Tour.find(), query)

//     const tours = await queryBuilder
//         .search(tourSearchableFields)
//         .filter()
//         .sort()
//         .fields()
//         .paginate()

//     // const meta = await queryBuilder.getMeta()

//     const [data, meta] = await Promise.all([
//         tours.build(),
//         queryBuilder.getMeta()
//     ])

//     return {
//         data,
//         meta
//     }
// };

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  if (payload.title) {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`; // dhaka-division-2
    }

    payload.slug = slug;
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }
  const name = payload.name;
  return await TourType.create({ name });
};
const getAllTourTypes = async () => {
  return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
};
