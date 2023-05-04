import React from 'react';
import {Pressable, View, Image} from 'react-native';

import Text from 'components/Text';
import Modal from 'components/Modal';
import {_} from 'services/i18n';

import styles from './styles';

const pdfIcon = require('assets/images/pdf.png');
const pngIcon = require('assets/images/image.png');
const csvIcon = require('assets/images/csv.png');
const copyIcon = require('assets/images/copy.png');

const ActionItem = ({
    onPress,
    title,
    icon,
}: {
    onPress?(): void;
    title: string;
    icon?: string;
}) => {
    return (
        <Pressable style={styles.option} onPress={onPress}>
            <Image source={icon || pdfIcon} style={styles.icon} />
            <Text style={styles.title} title={title} />
        </Pressable>
    );
};

interface Props {
    isOpenExport: boolean;
    onBackdropPress(): void;
    onClickExportImage(): void;
    onClickExportCSV(): void;
    onCopyLink?(): void;
}
const ExportActions: React.FC<Props> = ({
    isOpenExport,
    onBackdropPress,
    onClickExportImage,
    onClickExportCSV,
    onCopyLink,
}) => {
    return (
        <Modal
            isVisible={isOpenExport}
            onBackdropPress={onBackdropPress}
            style={styles.actionModal}>
            <View style={styles.options}>
                <ActionItem
                    title={_('Export as Image (PNG)')}
                    onPress={onClickExportImage}
                    icon={pngIcon}
                />
                <ActionItem
                    title={_('Export as Data (CSV)')}
                    onPress={onClickExportCSV}
                    icon={csvIcon}
                />
                {onCopyLink && (
                    <ActionItem
                        title={_('Copy link to survey')}
                        onPress={onCopyLink}
                        icon={copyIcon}
                    />
                )}
            </View>
        </Modal>
    );
};

export default ExportActions;
