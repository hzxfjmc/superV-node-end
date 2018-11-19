import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_authorize'
})
export default class Authorize extends Model<Authorize> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        comment: '父节点id',
        field: 'parent_id'
    })
    public parentId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(),
        comment: '权限路由',
        field: 'value'
    })
    public value: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(),
        comment: '权限路由名字',
        field: 'name'
    })
    public name: string;

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
