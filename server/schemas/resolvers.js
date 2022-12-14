const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { _id }, context) => {
        
            if (context.user) {
            return User.findOne({
                _id: context.user._id 
                });
            }
            throw new AuthenticationError('You need to be logged in! resolvers');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        
        saveBook: async (parent, { content }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    {$addToSet: { savedBooks: content }},
                    {new: true,
                    runValidators: true,
                    }
                );
            }
              // If user attempts to execute this mutation and isn't logged in, throw an error
                throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            console.log(bookId)
            if (context.user) {
                const book = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: {bookId} } }
                );
                    console.log(book)
                return book;
            }
            throw new AuthenticationError('You need to be logged in!');
            },
    
        },
    };
    
    module.exports = resolvers;