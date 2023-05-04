const Project = require('../models/Project.js');
const Client = require('../models/Client.js');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

// GraphQL Object Types
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    client: { 
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      }
    },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
  })
});

// GraphQL Base Query
const RootQuery = new GraphQLObjectType ({
  name: 'RootQueryType',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString)},
        email: { type: GraphQLNonNull(GraphQLString)},
        phone: { type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone
        });

        return client.save();
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString)},
        description: { type: GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              'new': { value: 'Not started' },
              'progress': { value: 'In Progress' },
              'completed': { value: 'Completed' },
            }
          }),
          defaultValue: 'Not Started'
        },
        clientId: { type: GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.email,
          status: args.phone,
          clientId: args.clientId,
        });

        return project.save();
      }
    },
  }
})

module.exports = new GraphQLSchema({ 
  query: RootQuery,
  mutation
})