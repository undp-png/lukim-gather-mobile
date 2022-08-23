import React from 'react';
import {View} from 'react-native';

import WebViewer from 'components/WebViewer';

import styles from './styles';

const aboutData = `<p>
        <span style="color: #000000;">As part of the </span>
        <a href="http://www.png-nrmhub.org" style="text-decoration: none;">
            <span style="color: #1155cc;"><u>Papua New Guinea Natural Resource Management Hub</u></span>
        </a>
        <span style="color: #000000;">
            , the Lukim Gather mobile application supports the collection of ground-level conservation and biodiversity data. The aim of the app is to improve biodiversity monitoring and management effectiveness, particularly to strengthen
            Papua New Guinea&rsquo;s protected area network and assist in prioritizing investments in biodiversity and climate projects.&nbsp;
        </span>
    </p>
    <p>
        <span style="color: #000000;">Lukim Gather is user-friendly, open source, and is helping communities overcome many of the challenges that prevent the effective tracking and management of natural resources within the region.&nbsp;</span>
    </p>
    <p>
        <span style="color: #000000;">
            It saves time, money, and resources by providing free mobile infrastructure (which works entirely offline) for users to collect and share social and environmental information, share and store data online, and anonymously report on
            environmental incidents.&nbsp;
        </span>
    </p>
    <p>
        <span style="color: #000000;">
            The app is designed to help community members, leaders, protected area management committees, NGOs and civil society organizations report on threats, benefits and values that are perceived in the environment.&nbsp;
        </span>
    </p>
    <p>
        <span style="color: #000000;">Mapping can be done easily by users and published publicly, anonymously, or privately.&nbsp; This information can contribute to regular updates to the </span>
        <a href="http://pngbiodiversity.org/management-and-monitoring/" style="text-decoration: none;">
            <span style="color: #1155cc;"><u>PNG-Management Effectiveness Tracking Tool</u></span>
        </a>
        <span style="color: #000000;">, part of the Protected Area Policy.&nbsp;</span>
    </p>
    <p>
        <span style="color: #000000;">To learn more, visit </span>
        <a href="http://www.lukimgather.org" style="text-decoration: none;">
            <span style="color: #1155cc;"><u>www.lukimgather.org</u></span>
        </a>
        <span style="color: #000000;"> or simply create an account on the application to start testing it out. You can view your data and create maps using your user credentials on the Lukim Gather website.&nbsp;</span>
    </p>
`;

const About = () => {
    return (
        <View style={styles.container}>
            <WebViewer html={aboutData} />
        </View>
    );
};

export default About;
