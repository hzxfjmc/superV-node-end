import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_user_info'
})
export default class UserInfo extends Model<UserInfo> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        comment: '手机号',
        field: 'phone'
    })
    public phone: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100),
        comment: '密码',
        field: 'password'
    })
    public password: string;

    @AllowNull(false)
    @Column({
        type: DataType.DATE(),
        comment: '到期时间',
        field: 'auth_end_time'
    })
    public authEndTime: Date;

    @AllowNull(false)
    @Default(1)
    @Column({
        type: DataType.INTEGER(),
        comment: '用户状态 1 正常 2 冻结 3 过期 4 删除',
        field: 'status'
    })
    public status: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100),
        comment: '邮箱',
        field: 'email'
    })
    public email: string;

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
