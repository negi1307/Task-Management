const userModel = require("../models/users.model");
const taskModel = require("../models/task.model");
const nodemailer = require("../middleware/nodemailer");
const bcrypt = require("bcrypt");
const { accessToken } = require("../middleware/jwt.auth");
const subTaskModel = require("../models/subTask.model");
const { userHistory } = require('../controller/history.controller');

// Register a user or invite a user 
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, designationId, technologyId } = req.body;
    if ((role === 'CTO' || role === 'PM') && (await userModel.findOne({ role }))) {
      return res.status(200).json({ status: "400", message: `${role} already exists` });
    }
    else {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(200).json({ status: "400", message: "Email already exists" });
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 9);
        const result = await userModel.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          plainPassword: password,
          role,
          designationId,
          technologyId
        });
        if (result) {
          await nodemailer.emailSender(result);
          return res.status(200).json({ status: "200", message: "User created Successfully", response: result });
        }
        else {
          return res.status(200).json({ status: "400", message: 'User not created' });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// Log In of A User
const logInUser = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: { $regex: new RegExp('^' + req.body.email + '$') } });
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
      if (isPasswordValid) {
        const token = await accessToken(existingUser);
        const update = await updateTaskStatus(existingUser._id)
        if (update) {
          return res.status(200).json({ status: "200", message: "User logged in successfully", response: existingUser, token });
        }
      } else {
        return res.status(200).json({ status: "400", message: "Incorrect password" });
      }
    } else {
      return res.status(200).json({ status: "400", message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
};

// Update task status
async function updateTaskStatus(existingUser) {
  try {
    const taskIds = await taskModel.distinct('taskId', { assigneeId: existingUser._id });
    const tasks = await taskModel.find({ _id: { $in: taskIds }, status: 2 });
    for (const task of tasks) {
      await taskModel.updateOne({ _id: task._id }, { $currentDate: { logInTime: true } });
    }
    return true;
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    return false;
  }
}

// Get All Users
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const query = { role: { $ne: 'Admin' } };

    const totalCount = await userModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const result = await userModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();

    return res.status(200).json({ status: "200", message: 'User data fetched successfully', response: result, totalCount: totalCount, totalPages: totalPages });
  } catch (error) {
    return res.status(500).json({ status: "500", message: 'Something went wrong' });
  }
}



// Delete A User
const deleteUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await userModel.find(userId)
    await userModel.findByIdAndDelete(userId);
    await userHistory(req, user);
    return res.status(200).json({ status: "200", message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: '500', message: 'Something went wrong' })
  }
}

// Time tracking of users spend time in a month
const trackTime = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const timeTrackingData = await taskModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
          },
          'timeTracker': { $exists: true }
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projects',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assigneeId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $group: {
          _id: {
            userId: '$user._id',
            projectName: '$projects.projectName',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
          },
          timeSpent: {
            $sum: '$timeTracker',
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          user: {
            $first: {
              firstName: '$_id.firstName',
              lastName: '$_id.lastName',
            },
          },
          projects: {
            $push: {
              projectName: '$_id.projectName',
              timeSpent: '$timeSpent',
            },
          },
          totaltimeSpent: {
            $sum: '$timeSpent',
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          projects: {
            $map: {
              input: '$projects',
              as: 'project',
              in: {
                projectName: { $arrayElemAt: ['$$project.projectName', 0] }, // Extract the single element from the array
                timeSpent: {
                  $concat: [
                    {
                      $toString: {
                        $floor: {
                          $divide: ['$$project.timeSpent', 3600000], // Convert milliseconds to hours
                        },
                      },
                    },
                    'h ',
                    {
                      $toString: {
                        $floor: {
                          $mod: [
                            {
                              $divide: ['$$project.timeSpent', 60000], // Convert milliseconds to minutes
                            },
                            60,
                          ],
                        },
                      },
                    },
                    'm',
                  ],
                },
              },
            },
          },
          totalTimeSpent: {
            $concat: [
              {
                $toString: {
                  $floor: {
                    $divide: ['$totaltimeSpent', 3600000],
                  },
                },
              },
              'h ',
              {
                $toString: {
                  $floor: {
                    $mod: [
                      {
                        $divide: ['$totaltimeSpent', 60000],
                      },
                      60,
                    ],
                  },
                },
              },
              'm',
            ],
          },
        },
      },
    ]);
    return res.status(200).json({ status: "200", message: "Time Tracking Data Fetched Successfully", response: timeTrackingData });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

/*// {
//   $facet: {
//     // Branch 1: Original output grouped by project and user
//     "projectUserTime": [
//       {
//         $group: {
//           _id: {
//             userId: '$user._id',
//             userName: '$user.firstName',
//             userLastName: '$user.lastName',
//             project: { $first: '$projects.projectName' },
//           },
//           totalTrackingTime: {
//             $sum: '$timeTracker',
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           project: '$_id.project',
//           userId: '$_id.userId',
//           userName: '$_id.userName',
//           userLastName: '$_id.userLastName',
//           formattedTrackingTime: {
//             $concat: [
//               {
//                 $toString: {
//                   $trunc: {
//                     $divide: ['$totalTrackingTime', 3600000], // Convert to hours
//                   },
//                 },
//               },
//               'h ',
//               {
//                 $toString: {
//                   $trunc: {
//                     $mod: [
//                       {
//                         $divide: ['$totalTrackingTime', 60000], // Convert to minutes
//                       },
//                       60,
//                     ],
//                   },
//                 },
//               },
//               'm',
//             ],
//           },
//         },
//       },
//     ],
//     // Branch 2: Total time spent by each user across all projects
//     "totalUserTime": [
//       {
//         $group: {
//           _id: {
//             userId: '$user._id',
//             userName: '$user.firstName',
//             userLastName: '$user.lastName',
//           },
//           totalTrackingTime: {
//             $sum: '$timeTracker',
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id.userId',
//           userName: '$_id.userName',
//           userLastName: '$_id.userLastName',
//           totalTrackingTime: {
//             $concat: [
//               {
//                 $toString: {
//                   $trunc: {
//                     $divide: ['$totalTrackingTime', 3600000], // Convert to hours
//                   },
//                 },
//               },
//               'h ',
//               {
//                 $toString: {
//                   $trunc: {
//                     $mod: [
//                       {
//                         $divide: ['$totalTrackingTime', 60000], // Convert to minutes
//                       },
//                       60,
//                     ],
//                   },
//                 },
//               },
//               'm',
//             ],
//           },
//         },
//       },
//     ],
//   },
// },*/


// list of assignees
const getAssigneesList = async (req, res) => {
  try {
    const userRole = req.user.role;
    let assignableRoles = [];

    switch (userRole) {
      case 'Admin':
        assignableRoles = ['Employee', 'CTO', 'PM', 'Sales', 'Testing'];
        break;
      case 'CTO':
        assignableRoles = ['Employee', 'PM', 'Sales', 'Testing'];
        break;
      case 'PM':
        assignableRoles = ['Employee', 'CTO', 'PM', 'Sales', 'Testing'];
        break;
      default:
        assignableRoles = [];
        break;
    }
    const usersList = await userModel.find({ role: { $in: assignableRoles } });
    return res.status(200).json({ status: 200, response: usersList });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// get the list of reporters so the employee report to the senior
const getReporterList = async (req, res) => {
  try {
    const userRole = req.user.role;
    let assignableRoles = [];
    switch (userRole) {
      case 'Admin':
        assignableRoles = ['Admin', 'CTO', 'PM'];
        break;
      case 'CTO':
        assignableRoles = ['CTO', 'PM'];
        break;
      case 'PM':
        assignableRoles = ['PM'];
        break;
      default:
        assignableRoles = [];
        break;
    }
    const reporterList = await userModel.find({ role: { $in: assignableRoles } });
    return res.status(200).json({ status: 200, reporterList });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}

// Time trackiing for subtasks
const subTaskTrackTime = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const timeTrackingData = await subTaskModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthStart,
            $lt: monthEnd,
          },
          'timeTracker': { $exists: true }
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projects',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assigneeId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $group: {
          _id: {
            userId: '$user._id',
            projectName: '$projects.projectName',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
          },
          timeSpent: {
            $sum: '$timeTracker',
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          user: {
            $first: {
              firstName: '$_id.firstName',
              lastName: '$_id.lastName',
            },
          },
          projects: {
            $push: {
              projectName: '$_id.projectName',
              timeSpent: '$timeSpent',
            },
          },
          totaltimeSpent: {
            $sum: '$timeSpent',
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          projects: {
            $map: {
              input: '$projects',
              as: 'project',
              in: {
                projectName: { $arrayElemAt: ['$$project.projectName', 0] },
                timeSpent: {
                  $concat: [
                    {
                      $toString: {
                        $floor: {
                          $divide: ['$$project.timeSpent', 3600000],
                        },
                      },
                    },
                    'h ',
                    {
                      $toString: {
                        $floor: {
                          $mod: [
                            {
                              $divide: ['$$project.timeSpent', 60000], // Convert milliseconds to minutes
                            },
                            60,
                          ],
                        },
                      },
                    },
                    'm',
                  ],
                },
              },
            },
          },
          totalTimeSpent: {
            $concat: [
              {
                $toString: {
                  $floor: {
                    $divide: ['$totaltimeSpent', 3600000],
                  },
                },
              },
              'h ',
              {
                $toString: {
                  $floor: {
                    $mod: [
                      {
                        $divide: ['$totaltimeSpent', 60000],
                      },
                      60,
                    ],
                  },
                },
              },
              'm',
            ],
          },
        },
      },
    ]);
    return res.status(200).json({ status: "200", message: "Time Tracking Data Fetched Successfully", response: timeTrackingData });
  } catch (error) {
    return res.status(500).json({ status: "500", message: "Something went wrong", error: error.message });
  }
}


// specific user tasks and their count
const getStatusCounts = async (taskQuery) => {
  const statusMapping = {
    1: "Todo",
    2: "In Progress",
    3: "Testing",
    4: "Done",
    5: "Hold"
  };
  const statusCounts = {};
  const statusValues = Object.keys(statusMapping);
  for (const status of statusValues) {
    const count = await taskModel.countDocuments({ ...taskQuery, status });
    statusCounts[statusMapping[status]] = count;
  }
  return statusCounts;
};


// specific User tasks according to the specific project
const specificUserTask = async (req, res) => {
  try {
    const { userId, projectId } = req.query;
    const query = { assigneeId: userId };
        if (projectId) {
      query.projectId = projectId;
    }    
    const userTasks = await taskModel.find(query);
    const tasksByStatus = await getStatusCounts(query);
    const response = { totalTasks: userTasks.length, ...tasksByStatus };
    return res.status(200).json({ status: 200, message: "User's tasks fetched successfully", response, tasks: userTasks });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
  }
};





module.exports = {
  registerUser,
  logInUser,
  getUsers,
  deleteUser,
  trackTime,
  getAssigneesList,
  getReporterList,
  subTaskTrackTime,
  specificUserTask
};