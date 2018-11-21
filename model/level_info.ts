import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_level_info'
})
export default class LevelInfo extends Model<LevelInfo> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        comment: '等级期限',
        field: 'term'
    })
    public term: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(1),
        comment: '单位',
        field: 'unit'
    })
    public unit: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100),
        comment: '等级描述',
        field: 'remark'
    })
    public remark: string;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(20 , 2),
        comment: '等级消耗 单位元',
        field: 'level_price'
    })
    public levelPrice: number;

    @AllowNull(false)
    @Default(1)
    @Column({
        type: DataType.INTEGER(),
        comment: '等级状态 1 正常 2 删除',
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
