interface SentimentMap {
    [key: string]: string;
}

const sentimentName: SentimentMap = {
    '🙁': 'Sad',
    '🙂': 'Happy',
    '😐': 'Neutral',
};

export default sentimentName;
