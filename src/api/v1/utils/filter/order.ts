export const FilterOrders = ({ search = '', rows = 1000 }: any) => {
  let filter = {}
  let options = {}
  filter = Object.assign(filter)
  if (search && (search as string).trim().length > 0) {
    filter = Object.assign(filter, {
      $or: [
        {
          OrderID: search
        },
        {
          phone: search
        }
      ]
    })
  }
  options = Object.assign(options, { limit: rows })
  options = Object.assign(options, { sort: { createdAt: -1 } })
  return { filter, options }
}
