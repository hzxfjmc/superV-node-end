import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_article_folder'
})
export default class articleFolder extends Model<articleFolder> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        comment: '所属用户id',
        field: 'user_id'
    })
    public userId: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
        comment: '文件夹名',
        field: 'folder_name'
    })
    public folderName: string;

    @AllowNull(false)
    @Column({
        type: DataType.TINYINT(),
        comment: '状态 1 正常 2 删除',
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
