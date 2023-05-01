import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';

export const b64toPath = async (_dataURI: string) => {
    const dataURIPattern = /data:image\/.*;base64,/;
    _dataURI = _dataURI.split(dataURIPattern)[1];
    const filePath = RNFetchBlob.fs.dirs.CacheDir + `/${uuid.v4()}.jpg`;
    await RNFetchBlob.fs.writeFile(filePath, _dataURI, 'base64');
    return Platform.OS === 'android' ? 'file://' + filePath : filePath;
};
