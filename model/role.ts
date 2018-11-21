import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_role'
})
export default class Role extends Model<Role> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        comment: '角色名',
        field: 'role_name'
    })
    public roleName: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT(),
        comment: '权限列表',
        field: 'authorize'
    })
    public authorize: string;

    @AllowNull(false)
    @Default(1)
    @Column({
        type: DataType.INTEGER(),
        comment: '角色状态 1 正常 2 删除',
        field: 'status'
    })
    public status: number;

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