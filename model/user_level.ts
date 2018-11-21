import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_user_level'
})
export default class UserLevel extends Model<UserLevel> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'user_id',
        comment: '用户id'
    })
    public userId: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'level_code',
        comment: '当前用户等级'
    })
    public levelCode: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'history_code',
        comment: '历史用户等级'
    })
    public historyCode: number;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        field: 'create_time',
        comment: '创建日期'
    })
    public createTime: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        field: 'update_time',
        comment: '更新日期'
    })
    public updateTime: Date;

}
