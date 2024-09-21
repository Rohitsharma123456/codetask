module.exports = (sequelize, DataTypes) => {
    const Collection = sequelize.define('Collection', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true ,
            autoIncrement: true, // PRIMARY KEY constraint
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users', // FOREIGN KEY constraint (refers to User model)
                key: 'id'
            },
            onDelete: 'CASCADE', // Optional: Ensures that when a user is deleted, the related recommendations are also deleted
            onUpdate: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    }, {
        tableName: 'collection',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['id'] // UNIQUE constraint on 'id'
            }
        ],
        constraints: [
            {
                fields: ['user_id'],
                type: 'foreign key',
                name: 'recommendations_user_id_fkey', // Name of the foreign key constraint
                references: {
                    table: 'users',
                    field: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        ]
    });
    Collection.associate = function(models) {
     
        Collection.hasMany(models.Collection_recommendation, {
            foreignKey: 'collection_id', // This refers to the foreign key in Collection_recommendation
            sourceKey: 'id', // This refers to the primary key in Collectio
        });
       
        
      
      }
    return Collection
    }
    
    