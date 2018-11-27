import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt, Default } from 'sequelize-typescript';

@Table({
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    freezeTableName: true,
    tableName: 'tb_article'
})
export default class Article extends Model<Article> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    public id: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(50),
        comment: '文章标题',
        field: 'article_title'
    })
    public articleTitle: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(100),
        comment: '文章描述',
        field: 'article_desc'
    })
    public articleDesc: string;

    @AllowNull(true)
    @Column({
        type: DataType.TEXT(),
        comment: '文章配置',
        field: 'article_config'
    })
    public articleConfig: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(200),
        comment: '文章发布地址',
        field: 'article_deploy_path'
    })
    public articleDeployPath: string;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.INTEGER(),
        comment: '文章所属分类',
        field: 'article_type_id'
    })
    public articleTypeId: number;

    @AllowNull(false)
    @Default(1)
    @Column({
        type: DataType.TINYINT(),
        comment: '文章状态 1 草稿 2 未公开 3 公开 4 删除',
        field: 'status'
    })
    public status: number;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.INTEGER(),
        comment: '阅读数',
        field: 'read_total'
    })
    public readTotal: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER(),
        comment: '所属用户',
        field: 'user_id'
    })
    public userId: number;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(),
        comment: '生成页面的来源地址',
        field: 'channel_url'
    })
    public channelUrl: string;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.TINYINT(),
        comment: '是否公开发布 0 否 1 是',
        field: 'is_public'
    })
    public isPublic: number;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.TINYINT(),
        comment: '是否显示发布人',
        field: 'is_show_info'
    })
    public isShowInfo: number;

    @AllowNull(false)
    @Default(1)
    @Column({
        type: DataType.TINYINT(),
        comment: '是否分享显示发布人头像',
        field: 'share_show'
    })
    public shareShow: number;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.TINYINT(),
        comment: '是否加版权声明',
        field: 'add_copyright'
    })
    public addCopyright: number;

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
