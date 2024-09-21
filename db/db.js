const { Sequelize } = require('sequelize');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);
var db = {}

let sequelize;
// Initialize Sequelize
sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  dialect: 'postgres',
  port: 5432,
  logging:false,
  dialectOptions: {
    ssl: {
      require: true, // Use SSL if required
      rejectUnauthorized: false, // For self-signed certs
    },
    options: `project=${ENDPOINT_ID}`, // Custom connection options
  },
});
let models = [
    require("../models/users.js"),
    require("../models/recommendations.js"),
    require("../models/collection.js"),
    require("../models/collection_recommendation.js"),
]

// Initialize models
models.forEach(model => {
    const seqModel = model(sequelize, Sequelize)
    db[seqModel.name] = seqModel
})

// Apply associations
Object.keys(db).forEach(key => {
    if ('associate' in db[key]) {
        db[key].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize.sync()



module.exports={db}

