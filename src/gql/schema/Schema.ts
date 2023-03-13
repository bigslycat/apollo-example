import { gql } from '@apollo/client'

import { Mutation } from './Mutation'
import { Query } from './Query'
import { Todo } from './Todo'

export default gql`
  ${Query}
  ${Mutation}

  ${Todo}
`
