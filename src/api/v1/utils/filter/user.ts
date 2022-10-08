import { Role } from '@api-v1/types'

export const FilterUsers = ({
  search = '',
  rows = 1000,
  role = Role.USER
}: any) => {
  let filter = {}
  let options = {}
  filter = Object.assign(filter, { role })
  if (search && (search as string).trim().length > 0) {
    filter = Object.assign(filter, {
      $or: [
        { $text: { $search: search } },
        {
          name: { $regex: `${search}`, $options: 'i' }
        }
      ]
    })
  }
  options = Object.assign(options, { limit: rows })
  options = Object.assign(options, { sort: { createdAt: -1 } })
  return { filter, options }
}
