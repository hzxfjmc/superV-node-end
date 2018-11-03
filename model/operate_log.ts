import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import Activity from './activity';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_operate_log'
})
export default class OperateLog extends Model<OperateLog> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @ForeignKey(() => Activity)
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'activity_id',
        comment: '活动配置id'
    })
    public activityId: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'action',
        comment: '操作事件 暂存、修改活动配置、上架、下架、删除'
    })
    public action: string;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'state',
        comment: '操作后状态 0：暂存 1：上架 2：下架 3：删除'
    })
    public state: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'operator_name',
        comment: '操作人'
    })
    public operatorName: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'operator_id',
        comment: '操作人id'
    })
    public operatorId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'operator_department_name',
        comment: '操作人部门'
    })
    public operatorDepartmentName: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        field: 'remark',
        comment: '备注'
    })
    public remark: string;

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
