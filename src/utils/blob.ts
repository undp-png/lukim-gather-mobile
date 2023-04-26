import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const b64toBlob = async (_dataURI: string) => {
    _dataURI = _dataURI.split('data:image/jpeg;base64,')[1];
    const filePath = RNFetchBlob.fs.dirs.CacheDir + '/image.jpg';
    await RNFetchBlob.fs.writeFile(filePath, _dataURI, 'base64');
    return Platform.OS === 'android' ? 'file://' + filePath : filePath;
};
