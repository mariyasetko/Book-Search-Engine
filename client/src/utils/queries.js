import { gql } from '@apollo/client';

export const GET_ME = gql`
    query Me {
        me {
            username
            email
            password
            bookCount
            savedBooks {
                authors
                description
                bookId
                link
                title
            }
        }
    }
`;