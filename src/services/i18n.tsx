import {store} from 'store';
import {defaultTranslator as translator} from '@rna/components/I18n/i18nContext';

export const translations = {
    en: {},
    tpi: {
        Language: 'Tokpeles',
        'Publish an issue': 'Tokaut lo sampla samting',
        'Upload photos, title and description of any issue':
            'Kisim piksa, nem na stori blo ol wari blo yu',
        'Get Started': 'Stat',
        'Email or Phone': 'Imel o fone namba',
        Password: 'Paswet',
        Login: 'Go insait',
        'Forgot your password?': 'Lus ting lo paswet?',
        "Don't have an account?": 'Nogat akaun?',
        'First name': 'Nem blo yu',
        Surname: 'Nem blo papa',
        'By continuing you agree to our':
            'Yu orait lo ol toktok blo mipla sopos',
        'Terms of services': 'yu go yet',
        and: 'lo',
        'Privacy policy.': 'displa website.',
        'Create an account': 'Mekim akaun',
        'Already have an account?': 'Yu gat akaun pinis?',
        Settings: 'Ol toktok blo displa wok',
        Feedback: 'Toktok blo halivim wok',
        Help: 'Halivim',
        Place: 'Peles',
        Boundary: 'Banis',
        Building: 'Haus blo wok',
        Airstrip: 'Peles balus',
        Camp: 'Peles blo silip or wok',
        Community: 'Ol lain stap wantem',
        House: 'Haus blo silip',
        Path: 'Hap blo wokabaut',
        Factory: 'Peles blo wokim ol samting',
        Road: 'Rot',
        Construction: 'Work hap',
        'Oil and gas extraction': 'Rausim oil na gas',
        Energy: 'Pawa',
        Nature: 'Peles i stap olosem yet',
        Tree: 'Diwai',
        Plant: 'Ol Diwai',
        Animal: 'Abus',
        River: 'Wara',
        Lake: 'Raunwara',
        Stream: 'Hanwara',
        Waterfall: 'Wara i pundaun',
        'Invasive Species': 'I karamapim Specis',
        'Coral reef': 'Ston blo solwara',
        'Sea grass': 'Grass blo solwara',
        Mangrove: 'Mangro',
        'Beautiful scenery': 'Naispla hap',
        People: 'Man meri',
        'Fishing site': 'Peles blo painim fis',
        'Hunting site': 'Peles blo painim abus',
        'Gathering site':
            'Peles blo bung / or Peles blo painim kaikai blo bus [Establish which one and retain]',
        Farmland: 'Peles blo wokim gaden',
        Aquaculture: 'Wok blo lukautim ol kaikai blo wara na solwara',
        Medicine: 'Marasin',
        'Sacred site': 'Peles tambu',
        History: 'Stori blo bipo',
        Employment: 'Wok',
        Tourism: 'Luk luk raun',
        'Artisanal Mining':
            'Wok painim ol mineral wer ol lain i usim han o ol liklik masin wer i no wok lo pawa',
        'Commercial Mining':
            'Wok painim ol mineral wer planti pawa na masin save wok',
        Poaching: 'Wok stil lo ol abus',
        Deforestation: 'Katim diwa',
        Conflict: 'Birua',
        Hazard: 'Toksave lo samting nogut',
        Threat: 'Mak lo samting nogu',
        Fire: 'Paia',
        Pollution: 'Ol pipia nogut',
        Volcano: 'Volkeno',
        Earthquake: 'Guria',
        Tsunami: 'Guria blo solwara',
        Landslide: 'Graun bruk',
        Erosion: 'Graun lus',
        Drought: 'Peles drai',
        Flooding: 'Wara karapim graun',
        Vandalism: 'Bagarapim ol samting',
    },
};

export const languages = [
    {code: 'en', title: 'English'},
    {code: 'tpi', title: 'Tok Pisin'},
];

export const _ = text => {
    const {
        locale: {currentLanguage, translations},
    } = store.getState();

    return translator(text, currentLanguage, translations);
};
