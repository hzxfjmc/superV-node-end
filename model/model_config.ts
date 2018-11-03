import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, ForeignKey } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_model_config'
})
export default class ModelConfig extends Model<ModelConfig> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'activity_type',
        comment: '活动模板配置类型 1: 注册页 2: 宣传页'
    })
    public activityType: number;

    @AllowNull(false)
    @Column({
       type: DataType.TEXT(),
       field: 'activity_config',
       comment: '默认模板配置的json'
    })
    public activityConfig: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100),
        field: 'model_img',
        comment: '模板配置图'
    })
    public modelImg: string;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        field: 'use_time',
        comment: '最近使用时间'
    })
    public useTime: Date;

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
