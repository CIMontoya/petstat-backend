const graphql = require('graphql')
const User = require('../models/user.js')
const House = require('../models/house.js')
const Pet = require('../models/pet.js')
const Activity = require('../models/activity.js')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
} = graphql

const UserType = new GraphQLObjectType({
   name: 'User',
   fields: () => ({
      id: {type: GraphQLID},
      password: {type: new GraphQLNonNull(GraphQLString)},
      userName: {type: new GraphQLNonNull(GraphQLString)},
      phoneNumber: {type: new GraphQLNonNull(GraphQLString)},
      name: {type: new GraphQLNonNull(GraphQLString)},
      status: {type: GraphQLBoolean},
      location: {type: GraphQLString},
      household_id: {
         type: HouseType,
         resolve(parent, arg) {
            return House.findById(parent.household_id)
         }
      }
   })
})

const HouseType = new GraphQLObjectType({
   name: 'House',
   fields: () => ({
      id: {type: GraphQLID},
      location: {type: new GraphQLNonNull(GraphQLString)},
      timezone: {type: new GraphQLNonNull(GraphQLString)},
      name: {type: new GraphQLNonNull(GraphQLString)},
      users: {type: new GraphQLList(UserType),
        resolve(parent, arg) {
            return User.find({household_id: parent.id})
         }
      },
      pets: {type: new GraphQLList(PetType),
        resolve(parent, arg) {
            return Pet.find({household_id: parent.id})
         }
      }
   })
})

const PetType = new GraphQLObjectType({
   name: 'Pet',
   fields: () => ({
      id: {type: GraphQLID},
      name: {type: new GraphQLNonNull(GraphQLString)},
      household_id: {
         type: HouseType,
         resolve(parent, arg) {
            return House.findById(parent.household_id)
         }
      },
      activities: {type: new GraphQLList(ActivityType),
        resolve(parent, arg) {
            return Activity.find({pet_id: parent.id})
         }
      }
   })
})

const ActivityType = new GraphQLObjectType({
   name: 'Activity',
   fields: () => ({
      id: {type: GraphQLID},
      activity: {type: new GraphQLNonNull(GraphQLString)},
      interval: {type: GraphQLInt},
      onSchedule: {type: GraphQLBoolean},
      times: {type: GraphQLList(GraphQLString)},
      dueDate: {type: GraphQLString},
      pet_id: {
         type: PetType,
         resolve(parent, arg) {
            return Pet.findById(parent.pet_id)
         }
      }
   })
})

const RootQuery = new GraphQLObjectType ({
   name: 'rootQueryType',
   fields: {
      house: {
         type: HouseType,
         args: {id: {type: GraphQLID}},
         resolve(parent, args) {
            return House.findById(args.id)
         }
      },
      users: {
         type: new GraphQLList(UserType),
         resolve(parent, args) {
            return User.find({})
         }
      }
   }
})

const Mutation = new GraphQLObjectType ({
   name: 'Mutation',
   fields: {
      addUser: {
         type: UserType,
         args: {
           id: {type: GraphQLID},
           password: {type: GraphQLString},
           userName: {type: GraphQLString},
           phoneNumber: {type: GraphQLString},
           name: {type: GraphQLString},
           status: {type: GraphQLBoolean},
           location: {type: GraphQLString},
           household_id: {type: GraphQLString}
         },
         resolve(parent, args) {
            let user = new User({
               password: args.password,
               name: args.name,
               phoneNumber: args.phoneNumber,
               userName: args.userName,
               location: args.location,
               household_id: args.household_id,
               status: args.status
            })
            return user.save();
         }
      },
      addHouse: {
         type: HouseType,
         args: {
           id: {type: GraphQLID},
           location: {type: GraphQLString},
           timezone: {type: GraphQLString},
           name: {type: GraphQLString},
         },
         resolve(parent, args) {
            let house = new House({
               location: args.location,
               timezone: args.timezone,
               name: args.name
            })
            return house.save();
         }
      },
      addPet: {
         type: PetType,
         args: {
           id: {type: GraphQLID},
           name: {type: GraphQLString},
           household_id: {type: GraphQLString}
         },
         resolve(parent, args) {
            let pet = new Pet({
               name: args.name,
               household_id: args.household_id
            })
            return pet.save();
         }
      },
      addActivity: {
         type: ActivityType,
         args: {
           id: {type: GraphQLID},
           activity: {type: GraphQLString},
           interval: {type: GraphQLString},
           onSchedule: {type: GraphQLBoolean},
           times: {type: GraphQLList(GraphQLString)},
           pet_id: {type: GraphQLString},
           dueDate: {type: GraphQLString}
         },
         resolve(parent, args) {
            let activity = new Activity({
               activity: args.activity,
               interval: args.interval,
               onSchedule: args.onSchedule,
               times: args.times,
               pet_id: args.pet_id,
               dueDate: args.dueDate
            })
            return activity.save();
         }
      }
   }
})

module.exports = new GraphQLSchema ({
   query: RootQuery,
   mutation: Mutation
})
