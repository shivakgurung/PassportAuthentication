module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return User;
};
// const User = sequelize.define('User', {
//     email: { type: Sequelize.STRING, allowNull: false, unique: true },
//     password: { type: Sequelize.STRING },
//     googleId: { type: Sequelize.STRING },
//     name: { type: Sequelize.STRING, allowNull: false },
// });
