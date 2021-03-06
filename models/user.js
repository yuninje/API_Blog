module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
        user_id : {
            field : 'user_id',
            type : DataTypes.STRING(30),
            primaryKey : true,
        },
        user_pw : {
            field : 'user_pw',
            type : DataTypes.STRING(100),
            allowNull : false,
        },
		email : {
            field : 'email',
			type : DataTypes.STRING(30),
            allowNull : false,
		},
		nick : {
            field : 'nick',
			type : DataTypes.STRING(10),
			allowNull : false,
			unique : true
		},
		name : {
            field : 'name',
			type : DataTypes.STRING(30),
			allowNull : false,
		},
	},{
		timestamps : false,  // createdAt, updatedAt column 생성
		paranoid : false, 	// deletedAt column 생성
        underscored: true,
        tableName: 'user',
        freezeTableName: true
    })

    user.association = (db) => {
        // USER & POST
        db.user.hasMany(db.post, {
            foreignKey : 'user_id'
        });
        // USER & COMMENT
        db.user.hasMany(db.comment, {
            foreignKey : 'user_id'
        });
        // LIKE : USER & POST
        db.user.belongsToMany(db.post,{
          through : 'like',
          foreignKey : 'user_id',
          timestamps : false,  // createdAt, updatedAt column 생성
          paranoid : false,    // deletedAt column 생성
        });
        // FOLLOW : USER & USER
        db.user.belongsToMany(db.user, {
            foreignKey : 'following_id',
            as : 'following_id',   //  해당 데이터를 요청했을 때 사용할 key 값 ( user.Followers )
            through : 'follow', //  만들 테이블
            timestamps : false,  // createdAt, updatedAt column 생성
            paranoid : false,    // deletedAt column 생성
        });
        // FOLLOW : USER & USER
        db.user.belongsToMany(db.user, {
            foreignKey : 'follower_id',
            as : 'follower_id',   //  해당 데이터를 요청했을 때 사용할 key 값 ( user.Followers )
            through : 'follow', //  만들 테이블
            timestamps : false,  // createdAt, updatedAt column 생성
            paranoid : false,    // deletedAt column 생성
        });
    }
    return user
}