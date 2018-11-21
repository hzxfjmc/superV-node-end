import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_user_wechat'
})
export default class userWechat extends Model<userWechat> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        comment: 'user_id',
        field: 'user_id'
    })
    public levelId: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(32),
        comment: 'unionId',
        field: 'union_id'
    })
    public unionId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(32),
        comment: 'open_id',
        field: 'open_id'
    })
    public openId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(50),
        comment: '微信昵称',
        field: 'nick'
    })
    public nick: string;

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
