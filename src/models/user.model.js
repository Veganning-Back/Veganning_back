const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // 다른 사용자 정보 필드 추가
    }, {
      tableName: 'user',
      timestamps: false,
    });
  
    return User;
  };
  
  export default UserModel;
  