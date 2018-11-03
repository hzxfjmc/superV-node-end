import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_activity'
})
export default class Activity extends Model<Activity> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(30),
        comment: '活动名称',
        field: 'activity_name'
    })
    public activityName: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(60),
        comment: '策略编号',
        field: 'strategy_number'
    })
    public strategyNumber: string;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        field: 'start_time',
        comment: '上架时间'
    })
    public startTime: Date;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        field: 'end_time',
        comment: '下架时间'
    })
    public endTime: Date;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        field: 'activity_type',
        comment: '活动类型 1: 注册页 2: 宣传页 3: 福利领取页'
    })
    public activityType: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'manager_name',
        comment: '负责人名字'
    })
    public managerName: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'manager_id',
        comment: '负责人id'
    })
    public managerId: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'department_name',
        comment: '负责人所属部门名称'
    })
    public departmentName: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        field: 'department_id',
        comment: '负责人所属部门id'
    })
    public departmentId: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(50),
        field: 'store_name',
        comment: '商户名称'
    })
    public storeName: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(20),
        field: 'store_number',
        comment: '商户号'
    })
    public storeNumber: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(60),
        field: 'invitation_code',
        comment: '邀请码'
    })
    public invitationCode: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        field: 'activity_desc',
        comment: '活动描述'
    })
    public activityDesc: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(20),
        field: 'share_title',
        comment: '分享标题'
    })
    public shareTitle: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100),
        field: 'share_icon',
        comment: '分享图标'
    })
    public shareIcon: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        field: 'share_desc',
        comment: '分享描述'
    })
    public shareDesc: string;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.INTEGER(),
        field: 'status',
        comment: '活动页状态 0:暂存, 1:上架, 2: 下架 3：删除'
    })
    public status: number;

    @AllowNull(true)
    @Column({
        type: DataType.TEXT(),
        comment: '活动配置的json对象',
        field: 'activity_json'
    })
    public activityJson: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        comment: '生成活动页的url',
        field: 'activity_page_url'
    })
    public activityPageUrl: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        comment: '生成暂存活动页的url',
        field: 'stash_page_url'
    })
    public stashPageUrl: string;

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
