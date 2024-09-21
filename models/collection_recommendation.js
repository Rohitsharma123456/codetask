module.exports = (sequelize, DataTypes) => {
    const Collection_recommendation = sequelize.define('Collection_recommendation', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true // PRIMARY KEY constraint
        },
        collection_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'collection', // Should refer to the correct model for collections
                key: 'id'
            },
            onDelete: 'CASCADE', // Ensures that when a collection is deleted, related entries are also deleted
            onUpdate: 'CASCADE'
        },
        recommendation_id: {
            type: DataTypes.BIGINT, // Assuming it's a BIGINT as well, change if necessary
            allowNull: false,
            references: {
                model: 'recommendations', // Should refer to the correct model for recommendations
                key: 'id'
            },
            onDelete: 'CASCADE', // Optional: Remove related entry if the recommendation is deleted
            onUpdate: 'CASCADE'
        }
    }, {
        tableName: 'collection_recommendation', // Correct table name (use lowercase and underscores)
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['id'] // UNIQUE constraint on 'id'
            }
        ]
    });
    Collection_recommendation.associate = function(models) {
     
        Collection_recommendation.belongsTo(models.Recommendation, {
            foreignKey: 'recommendation_id',targetKey: 'id'
          })
       
        
      
      }
    return Collection_recommendation;
}
