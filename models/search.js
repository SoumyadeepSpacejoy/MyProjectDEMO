'use strict';

const mongoose = require('mongoose');
const { User } = models;

exports.search = async (query, user, skip, limit) => {
    let searchQuery;

    query
        ? (searchQuery = {
              $and: [
                  { _id: { $ne: new mongoose.Types.ObjectId(user.id) } },
                  {
                      $or: [
                          {
                              name: { $regex: query, $options: 'i' },
                          },
                          {
                              email: { $regex: query, $options: 'i' },
                          },
                          {
                              phone: { $regex: query, $options: 'i' },
                          },
                      ],
                  },
              ],
          })
        : (searchQuery = { _id: { $ne: new mongoose.Types.ObjectId(user.id) } });

    const [users, count] = await Promise.all([
        User.find(searchQuery).select('-password -role -status').sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(searchQuery),
    ]);

    return { users, count };
};
