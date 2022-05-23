const advancedResults = (model, populate) => async (req, res, next) =>
{
let query
// make a copy of an object of query string so that it won't affect the original one
const reqQuery = { ...req.query }

// create fields to exclude that don't want to be matched for filtering
const removeFields = ['select', 'sort', 'page', 'limit']

// loop over removeFields and delete them from reqQuery is JS  way to delete key/value pair in object. like delete select=something from reqQuery
removeFields.forEach(param => delete reqQuery[param])
console.log(reqQuery) //return {} because key/value pair of removeFields has been removed from reqQuery

// create query string
let queryString = JSON.stringify(reqQuery) // object to string
// create operators such as $gt, $gte

queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`) // dollar sign and whatever match within the regex will put $ sign in front of it.
//console.log(queryString)

// find resources
//query = Bootcamp.find(JSON.parse(queryString)) // find({}) is an object
// reverse populate with virtual object to get an array of all courses
// limit certain fields to show, passing object with path and select to populate
//query = model.find(JSON.parse(queryString)).populate('courses')
query = model.find(JSON.parse(queryString))
// select fields req.query.select to check if the word select is there in query string
// in Postman {{URL}}/api/v1/bootcamps/?select=name,description
// but Mongoose query syntax is query.select('name description) no comma between fields
if(req.query.select) // look at the original req.query not reqQuery which is the one delete Select = something. Output only shows specific field
{
    const fields = req.query.select.split(',').join(' ') // extract two fields like name and description from select=name,description
    //Mongoose syntax query.select('name description)
    query = query.select(fields)
}

// sort by fields
if(req.query.sort)
{
    const sortBy = req.query.sort.replace(',', ' ')
    query = query.sort(sortBy)
}
else
{
    // default sort by date desc
    // query = query.sort('-createdAt') 
    // sort by date first and then name in desc if 2 dates the same
    query = query.sort({ "createdAt": 'asc', name: -1 })
}

// pagination ?limit=2 or ?page=2&limit=2
const page = parseInt(req.query.page, 10) || 1 // 10 base, 1 is default value for the requested page
const limit = parseInt(req.query.limit, 10) || 10 // page size which is number of items on a page
const startIndex = (page - 1) * limit 
const endIndex = page * limit
const total = model.find(JSON.parse(queryString)).countDocuments()

query = query.skip(startIndex).limit(limit)

// if using populate to populate particular field to pass in
if (populate)
{
    query = query.populate(populate)
}
// execute query
const results = await query
// show next or previous if available
const pagination = {}
if (endIndex < total)
{
    pagination.next = { page: page + 1,
                        limit 
                    }
}
if (startIndex > 0)
{
    pagination.prev = { page: page - 1,
                        limit 
                    }
}
// create res object that we can use any route
res.advancedResults = { success: true, count: results.length,
                        pagination, data: results
                    }
                    next()
}

module.exports = advancedResults