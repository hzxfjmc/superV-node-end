import { FdfsBusiness } from '../../../business/fdfs_business';
import { AbstractServices } from '../abstract_services';
import {SvrResponse} from '../../../model/common/svr_context';

export class FastdfsServices extends AbstractServices {
    private file: FdfsBusiness;
    constructor() {
        super();
        this.name = 'file';
        this.file = new FdfsBusiness();
    }

    public async upload(ctx, formData) {
        const res = new SvrResponse();
        const {name, size, path} = formData.file;
        const uploadOptions = {
            ext: name.split('.').pop(),
            size,
            path
        };
        const result: any = await this.file.uploadSingle(ctx, uploadOptions);
        if (result.display) {
            res.code = -1;
            res.display = result.display;
        } else {
            result.imgUrl = this.file.calcUrl(result.fileId, ctx.app.config.urlPrefix);
            res.content = result;
        }
        return res;
    }

    public download(ctx, formData) {
        return ctx.app.fdfs.download(formData.fileId, 'test_download.gif').then(function() {
            // 下载完成
            console.log('dsfsdf');
        }).catch(function(err) {
            console.error(err);
        });
    }
}
