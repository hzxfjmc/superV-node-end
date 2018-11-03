import * as crypto from 'crypto';

export default class AESHelper {
    public static key: string = 'cms';
    // static iv: string = '158e4d26b24d0ee04d13e36d2f7a7cd4409d5c28de285b0a859b661f4bd48dee';
    public static encrypt(data) {
        const cipher = crypto.createCipher('aes192', AESHelper.key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    public static decrypt(encrypted, key) {
        AESHelper.key = key;
        try {
            const decipher = crypto.createDecipher('aes192', AESHelper.key);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (ex) {
            return '';
        }
    }
}
