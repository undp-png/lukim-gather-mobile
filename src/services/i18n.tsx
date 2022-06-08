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
        Change: 'Senesim',
        'Change Password': 'Senesim Paswet',
        'Change password': 'Senesim paswet',
        Login: 'Go insait',
        'Log in': 'Go insait',
        'Forgot your password?': 'Lus ting lo paswet?',
        'Verify your email': 'Imel blo yu stret?',
        'Send Code': 'Salim hait toktok',
        'Please enter the 6 digit code sent to your email:':
            'Putim 6pla namba wer i kam lo imel',
        'Send the code again?': 'Salim hait toktok gen',
        Verify: 'I stret',
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
        'Account Settings': 'Ol toktok blo akaun',
        Automatic: 'Otomatic',
        'Yes, log out': 'Ya, liv',
        Feedback: 'Toktok blo halivim wok',
        'Issue type': 'Wanem kain toktok',
        'Explain the issue': 'Makim wanpela wari',
        'Select an issue': 'Makim wanpla toktok',
        Help: 'Halivim',
        Account: 'Akaun',
        Synchronization: 'Wok wantem',
        Map: 'Piksa blo peles',
        'Log out': 'Liv',
        Menu: 'Lis blo ol samting',
        'Enter first name': 'Putim nem blo you',
        'Enter surname': 'Putim nem blo papa',
        'Enter Password': 'Putim paswet',
        'Re-enter password': 'Putim gen paswet',
        'Enter the email address or phone number associated with your account':
            'Putim imel adres o fone namba wer i go wantem akaun',
        'Forgot password?': 'Lus ting lo paswet?',
        'Current password': 'Paswet blo yu nau',
        'Enter current password': 'Putim paswet ting lo paswet',
        'New password': 'Nupla paswet',
        'Enter new password': 'Putim nupla paswet',
        'Confirm new password': 'Tok stret sopos nupla paswet i orait',
        'Re-enter new password': 'Putim gen nupla paswet',
        'Choose a category': 'Makim wanpla hap wok',
        'My Entries': 'Wok blo you',
        Name: 'Nem blo',
        'Organization name': 'Nem blo wok peles',
        'Change photo': 'Senesim piksa',
        'Change Location': 'Narapla hap',
        'Edit Profile': 'Raitim stori blo yu',
        'Add Images': 'Putim Piksa',
        Location: 'Hap yu stap',
        Home: 'Haus',
        'How do you feel about this feature?':
            'Yu tingting olosem wonem lo displa?',
        "What's happening here?": 'Wonem samting kamap lo hia?',
        'Use my current location': 'Luksave lo hap wer mi stap nau',
        'Set on a map': 'Stap lo piksa blo peles',
        'Draw polygon': 'Makim lain',
        'Please check this box if you want to publish anonymously':
            'Putim mak lo bokis sopos yu nolaik ol lain save em wok blo yu',
        Submit: 'Salim igo',
        Publish: 'Mekim aut',
        Cancel: 'Rausim',
        Photos: 'Piksa',
        Feels: 'Pilim',
        Feel: 'Pilim',
        Improvement: 'Soim',
        Place: 'Peles',
        Boundary: 'Banis',
        Building: 'Haus blo wok',
        Airstrip: 'Peles balus',
        Camp: 'Peles blo silip or wok',
        Community: 'Komyuniti',
        House: 'Haus',
        Path: 'Rot blo kar',
        Factory: 'Faktori',
        Road: 'Rot blo kar',
        Construction: 'Hap blo wok',
        'Oil and gas extraction': 'Wok blo rausim oil na gas',
        Energy: 'Pawa',
        Nature: 'Peles i stap olosem yet',
        Tree: 'Diwai',
        Plant: 'Plaua',
        Animal: 'Abus',
        River: 'Wara',
        Lake: 'Raunwara',
        Stream: 'Liklik wara',
        Waterfall: 'Wara i pundaun',
        'Invasive Species': 'I karamapim Specis',
        'Coral reef': 'Rip',
        'Sea grass': 'Gras blo solwara',
        Mangrove: 'Mangro',
        'Beautiful scenery': 'Nais',
        People: 'Manmeri',
        'Fishing site': 'Hap blong painim fis',
        'Hunting site': 'Hap blong painim abus',
        'Gathering site': 'Hap blong bungim ol samtin',
        Farmland: 'Wokples blong didiman',
        Aquaculture: 'Wok blo lukautim ol kaikai blo wara na solwara',
        Medicine: 'Marasin',
        'Sacred site': 'Peles tambu',
        History: 'Histori',
        Employment: 'Wok',
        Tourism: 'Luk luk raun',
        'Artisanal Mining':
            'Wok painim ol mineral wer ol lain i usim han o ol liklik masin wer i no wok lo pawa',
        'Commercial Mining':
            'Wok painim ol mineral wer planti pawa na masin save wok',
        Poaching: 'Stil lo abus',
        Deforestation: 'Katim diwa',
        Conflict: 'Birua',
        Hazard: 'Toksave lo samting nogut',
        Threat: 'Mak lo samting nogu',
        Fire: 'Pai',
        Pollution: 'Pipia nogut',
        Volcano: 'Volkeno',
        Earthquake: 'Graun i guria',
        Tsunami: 'Wara i guria',
        Landslide: 'Graun i kapsait',
        Erosion: 'Graun i lus',
        Drought: 'Peles drai',
        Flooding: 'Wara karapim graun',
        Vandalism: 'Bagarapim ol samting',
    },
};

export const languages = [
    {code: 'en', title: 'English'},
    {code: 'tpi', title: 'Tok Pisin'},
];

export const _ = (text: string, lang: string | null = null) => {
    if (!lang) {
        const {
            locale: {currentLanguage, translations},
        } = store.getState();
        lang = currentLanguage;
    }

    return translator(text, lang, translations);
};
