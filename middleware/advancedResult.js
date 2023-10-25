const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // Copy req query
    const reqQuery = { ...req.query }
    //Fields to exclude 
    const removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach(params => delete reqQuery[params])
    //Create query string
    let queryStr = JSON.stringify(reqQuery)
    //Create operators
    queryStr = queryStr.replace(/\b(gt|gte|lte|in)\b/g, match => `$${match}`)

    //Finding resource
    query = model.find(JSON.parse(queryStr))

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
       
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    } else {
        query = query.sort('-createdAt')
    }
    //pagenations
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const totalDocuments = await model.countDocuments()
    query = query.skip(startIndex).limit(limit)



    if (populate) {

        query = query.populate(populate)

    }

    //Executing query
    const results = await query;




    let pagenations = {}

    if (endIndex < totalDocuments) {
        pagenations.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagenations.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        pagenations,
        count: results.length,
        data: results,
        msg: 'Show all data'
    }

    next()

}

module.exports = advancedResults