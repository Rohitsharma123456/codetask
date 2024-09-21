module.exports = (sequelize, DataTypes) => {
const Recommendation = sequelize.define('Recommendation', {
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
    caption: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'recommendations',
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
return Recommendation
}

