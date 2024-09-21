
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // PRIMARY KEY constraint
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // Unique email constraint
        validate: {
            isEmail: true
        }
    },
    fname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'users',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id', 'email']
        }
    ]
});
return User
}

