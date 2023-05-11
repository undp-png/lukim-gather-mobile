import React, {useCallback, useEffect, useState} from 'react';
import {
    Image,
    PermissionsAndroid,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    OutputFormatAndroidType,
    PlayBackType,
    RecordBackType,
} from 'react-native-audio-recorder-player';
import DocumentPicker, {
    isInProgress,
    types,
} from 'react-native-document-picker';
import {Icon} from 'react-native-eva-icons';
import RNFetchBlob, {RNFetchBlobFile} from 'rn-fetch-blob';

import Button from 'components/Button';
import Modal from 'components/Modal';
import {_} from 'services/i18n';
import Toast from 'utils/toast';

import cs from '@rna/utils/cs';

import styles from './styles';
import COLORS from 'utils/colors';

interface AudioProps {
    audio: {
        uri: string;
        name: string;
    };
    onRemoveAudio?(audio: null): void;
    isStatic?: boolean;
}

interface AudioPickerProps {
    onAddAudio: (audio: any) => void;
    onRemoveAudio?(audio: null): void;
    audio: any;
}

interface AudioRecorderModalProps {
    isVisible: boolean;
    onChange: (audio: RNFetchBlobFile) => void;
    onBackdropPress: () => void;
}

const responseToFile = (res: any) => {
    const audio = {
        name: res.name,
        type: res.mime,
        uri: Platform.OS === 'ios' ? res.path.replace('file://', '') : res.path,
    };
    return audio;
};

const dirs = RNFetchBlob.fs.dirs;
const extension = Platform.OS === 'android' ? 'mp4' : 'm4a';
const fileName = `survey_recording_${Date.now()}.${extension}`;
const path = Platform.select({
    ios: `${dirs.CacheDir}/${fileName}`,
    android: `${dirs.CacheDir}/${fileName}`,
});

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
    isVisible,
    onChange,
    onBackdropPress,
}) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [pauseRecording, setPauseRecording] = useState<boolean>(true);
    const [stopRecording, setStopRecording] = useState<boolean>(false);
    const [recordTime, setRecordTime] = useState<string>('00:00:00');
    const [audioFile, setAudioFile] = useState<RNFetchBlobFile | null>(null);

    const getPermissionAndroid = useCallback(async () => {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true;
            } else {
                Toast.error(_('Permission required'));
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }, []);

    const recordAudio = useCallback(async () => {
        if (!isRecording) {
            return;
        }

        try {
            if (Platform.OS === 'android') {
                const granted = await getPermissionAndroid();
                if (!granted) {
                    return;
                }
            }

            const audioSet: AudioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
                OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
            };

            const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
            const audioInfo = await RNFetchBlob.fs.stat(uri);
            setAudioFile({
                path: uri,
                mime: 'audio/mpeg',
                name: audioInfo.filename,
            });

            audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
                setRecordTime(
                    audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                );
            });
        } catch (error) {
            console.warn(error);
            return false;
        }
    }, [getPermissionAndroid, isRecording]);

    useEffect(() => {
        if (!isRecording) {
            return;
        }
        recordAudio();
        return () => {
            audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
        };
    }, [isRecording, recordAudio]);

    const handleRecordControl = useCallback(async () => {
        if (pauseRecording) {
            audioRecorderPlayer.pauseRecorder();
        } else {
            audioRecorderPlayer.resumeRecorder();
        }
        setPauseRecording(!pauseRecording);
    }, [pauseRecording]);

    const handleResetRecord = useCallback(async () => {
        try {
            await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
        } catch (error) {
            console.warn(error);
            return false;
        }
        setRecordTime('00:00:00');
        setIsRecording(false);
    }, [setRecordTime]);

    const handleStopRecord = useCallback(async () => {
        try {
            if (stopRecording) {
                setIsRecording(false);
                setStopRecording(false);
                if (audioFile) {
                    onChange?.(responseToFile(audioFile));
                }
                audioRecorderPlayer.removeRecordBackListener();
                onBackdropPress();
            } else {
                setStopRecording(true);
                setPauseRecording(false);
                await audioRecorderPlayer.stopRecorder();
            }
        } catch (error) {
            console.warn(error);
            return false;
        }
    }, [onBackdropPress, stopRecording, audioFile, onChange]);

    const RecordWelcomeScreen = () => {
        return (
            <View style={styles.record}>
                <Pressable onPress={() => setIsRecording(true)}>
                    <View style={styles.startRecordIcon}>
                        <Icon
                            name="mic-outline"
                            height={40}
                            width={40}
                            fill={COLORS.secondary}
                        />
                    </View>
                </Pressable>
                <Text style={styles.text}>{_('Click to start recording')}</Text>
            </View>
        );
    };

    const RecordScreen = () => {
        return (
            <View style={styles.recordContainer}>
                <Text style={styles.text}>
                    {stopRecording
                        ? 'Stopped'
                        : isRecording && pauseRecording
                        ? _('Recording...')
                        : _('Paused')}
                </Text>
                <Image
                    source={require('assets/images/wave.png')}
                    style={styles.wave}
                />
                <Text style={styles.txtRecordCounter}>{recordTime}</Text>
                <TouchableOpacity
                    onPress={handleRecordControl}
                    disabled={stopRecording}>
                    <Icon
                        name={pauseRecording ? 'pause-circle' : 'play-circle'}
                        height={53}
                        width={53}
                        fill={COLORS.secondary}
                        style={styles.recordIcon}
                    />
                </TouchableOpacity>
                <View style={styles.buttonWrapper}>
                    <Button
                        outline
                        style={styles.resetButton}
                        textStyle={styles.textStyle}
                        title={_('Reset')}
                        onPress={handleResetRecord}
                    />
                    <Button
                        style={cs(
                            styles.stopButton,
                            [{backgroundColor: COLORS.secondary}],
                            stopRecording,
                        )}
                        title={stopRecording ? _('Done') : _('Stop recording')}
                        onPress={handleStopRecord}
                    />
                </View>
            </View>
        );
    };

    const handleClose = useCallback(async () => {
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
        setPauseRecording(false);
        setStopRecording(false);
        onBackdropPress();
    }, [onBackdropPress]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleClose}
            style={styles.modal}>
            <View style={styles.modalContent}>
                <TouchableOpacity onPress={handleClose}>
                    <View style={styles.modalResponder} />
                </TouchableOpacity>
                {isRecording ? <RecordScreen /> : <RecordWelcomeScreen />}
            </View>
        </Modal>
    );
};

export const Audio: React.FC<AudioProps> = ({
    audio,
    onRemoveAudio,
    isStatic,
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
        };
    }, []);

    const onStartPlay = useCallback(async () => {
        try {
            await audioRecorderPlayer.startPlayer(
                audio?.uri || (audio as unknown as string),
            );
            audioRecorderPlayer.setVolume(1.0);
            audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
                if (e.currentPosition === e.duration) {
                    setIsPlaying(false);
                }
            });
            setIsPlaying(true);
        } catch (err) {
            console.warn(err);
        }
    }, [audio]);

    const onPausePlay = useCallback(async () => {
        await audioRecorderPlayer.pausePlayer();
        setIsPaused(true);
    }, []);

    const onResumePlay = useCallback(async () => {
        await audioRecorderPlayer.resumePlayer();
        setIsPaused(false);
    }, []);

    const handlePlayer = useCallback(() => {
        if (!isPlaying) {
            onStartPlay();
        } else if (isPaused) {
            onResumePlay();
        } else {
            onPausePlay();
        }
    }, [isPlaying, isPaused, onStartPlay, onPausePlay, onResumePlay]);

    const handleRemoveAudio = useCallback(async () => {
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        onRemoveAudio && onRemoveAudio(null);
    }, [onRemoveAudio]);

    const playStatusIcon = isPlaying
        ? isPaused
            ? 'play-circle'
            : 'pause-circle'
        : 'play-circle';

    return (
        <View style={styles.container}>
            <View style={styles.audioContainer}>
                <View style={styles.audioWrapper}>
                    <TouchableOpacity onPress={handlePlayer}>
                        <Icon
                            name={playStatusIcon}
                            height={40}
                            width={40}
                            fill={COLORS.blueText}
                            style={styles.audioIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.audioTitle}>
                        {audio?.name ||
                            audio?.substring(audio.lastIndexOf('/') + 1)}
                    </Text>
                </View>
                {!isStatic && (
                    <TouchableOpacity onPress={handleRemoveAudio}>
                        <Icon
                            name={'trash-2-outline'}
                            height={30}
                            width={30}
                            fill={COLORS.greyText}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const _AudioPicker: React.FC<AudioPickerProps> = ({
    onAddAudio: onChangeCallback,
    onRemoveAudio: onRemoveCallback,
    audio,
}) => {
    const [audioRecordVisible, setAudioRecordVisible] =
        useState<boolean>(false);

    const getPermissionAndroid = useCallback(async () => {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]);

            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                return true;
            } else {
                Toast.error(_('Permission required'));
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }, []);

    const RecordAudio = useCallback(() => {
        setAudioRecordVisible(!audioRecordVisible);
    }, [audioRecordVisible]);

    const close = useCallback(() => {
        setAudioRecordVisible(false);
    }, []);

    const onChange = useCallback(
        response => {
            onChangeCallback(response);
        },
        [onChangeCallback],
    );

    const handleError = useCallback((err: unknown) => {
        if (DocumentPicker.isCancel(err)) {
            console.warn('cancelled');
        } else if (isInProgress(err)) {
            console.warn(
                'multiple pickers were opened, only the last will be considered',
            );
        } else {
            throw err;
        }
    }, []);

    const handleAudioSelection = useCallback(async () => {
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }

        try {
            const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
                type: types.audio,
            });
            onChange?.(
                responseToFile({
                    path: pickerResult.fileCopyUri,
                    mime: pickerResult.type,
                    name: pickerResult.name,
                    size: pickerResult.size,
                }),
            );
        } catch (e) {
            handleError(e);
        }
    }, [handleError, getPermissionAndroid, onChange]);

    return audio ? (
        <Audio audio={audio} onRemoveAudio={onRemoveCallback} />
    ) : (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.recordOption}
                    onPress={RecordAudio}>
                    <Icon
                        name="mic-outline"
                        height={20}
                        width={20}
                        fill={'#99B9D1'}
                        style={styles.recordOptionIcon}
                    />
                    <Text style={styles.recordOptionText}>
                        {_('Record audio')}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.recordChoice}>{_('OR')}</Text>
                <TouchableOpacity
                    style={styles.recordOption}
                    onPress={handleAudioSelection}>
                    <Icon
                        name="upload-outline"
                        height={20}
                        width={20}
                        fill={'#99B9D1'}
                        style={styles.recordOptionIcon}
                    />
                    <Text style={styles.recordOptionText}>
                        {_('Upload audio')}
                    </Text>
                </TouchableOpacity>
            </View>
            <AudioRecorderModal
                isVisible={audioRecordVisible}
                onBackdropPress={close}
                onChange={onChange}
            />
        </>
    );
};

export default _AudioPicker;
