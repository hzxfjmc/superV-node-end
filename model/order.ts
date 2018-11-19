import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_order'
})
export default class order extends Model<order> {
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
        field: 'action',
        comment: '动作'
    })
    public action: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100),
        field: 'remark',
        comment: '动作描述'
    })
    public remark: string;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'price',
        comment: '消耗'
    })
    public price: number;

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
