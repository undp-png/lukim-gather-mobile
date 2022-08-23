import React from 'react';
import {View} from 'react-native';

import WebViewer from 'components/WebViewer';

import styles from './styles';

const helpData = `<p>
        <span style="color: #000000;"><strong>Getting Started With Lukim Gather</strong></span>
    </p>
    <p>
        <span style="color: #000000;">
            The Lukim Gather mobile application works on smartphones and tablets, and is now available to help users map and monitor the environment. This quick-start guide will get you started. For more extensive tutorials, including videos,
            check
        </span>
        <a href="http://www.lukimgather.org" style="text-decoration: none;">
            <span style="color: #1155cc;"><u>www.lukimgather.org</u></span>
        </a>
        <span style="color: #000000;">&nbsp;</span>
    </p>
    <ol>
        \r\n\t
        <li style="list-style-type: decimal;">
            <span style="color: #000000;"><strong>Why use the Lukim Gather app?</strong></span>
        </li>
        \r\n
    </ol>
    <p>
        <span style="color: #000000;">
            The Lukim Gather app has been developed by UNDP to help communities in Papua New Guinea collect, store, and manage environmental data on a map. This includes information about threats - such as illegal logging or poaching, values -
            such as potential tourism sites, important ecosystems and resources, and benefits of living in or around protected areas. This information can be shared within communities and used as a tool for advocacy and communication with
            government, donors, and organizations interested in assisting communities with environmental projects. Lukim Gather also:&nbsp;
        </span>
    </p>
    <ul>
        <li style="list-style-type: disc;"><span style="color: #000000;">Saves cost of data collection and storage&nbsp;</span></li>
        <li style="list-style-type: disc;"><span style="color: #000000;">Saves time and reduces errors caused by collecting data with paper&nbsp;</span></li>
        <li style="list-style-type: disc;"><span style="color: #000000;">Works offline on any smartphone&nbsp;</span></li>
        <li style="list-style-type: disc;"><span style="color: #000000;">Simple to use</span></li>
    </ul>
    <ol start="2">
        <li style="list-style-type: decimal;">
            <span style="color: #000000;"><strong>What kind of places should I map?&nbsp;</strong></span>
        </li>
    </ol>
    <p>
        <span style="color: #000000;">To assess the effectiveness of conservation areas, it is important to understand </span><span style="color: #000000;"><strong>where</strong></span>
        <span style="color: #000000;"> important features are, </span><span style="color: #000000;"><strong>what</strong></span><span style="color: #000000;"> their condition is, and </span>
        <span style="color: #000000;"><strong>how</strong></span>
        <span style="color: #000000;">
            they might be changing over time. It is also important to understand what threats are being observed. Therefore, when thinking of places to map, consider: what do I want people to know about why my conservation area is special? And
            what information will help my community, government, and/or supporting organizations manage the area better?
        </span>
    </p>
    <ol start="3">
        <li style="list-style-type: decimal;">
            <span style="color: #000000;"><strong>How To Collect &amp; Share Mapping Information Using Lukim Gather&nbsp;</strong></span>
        </li>
        <li style="list-style-type: decimal;">
            <span style="color: #222222;"><strong>Map out your environmental features</strong></span><span style="color: #222222;"> - Click the &lsquo;</span><span style="color: #222222;"><strong>+</strong></span>
            <span style="color: #222222;">&rsquo; icon in the center and find an icon that describes what you are mapping.</span>\r\n\t
            <ol>
                <li style="list-style-type: lower-alpha;">
                    <span style="color: #222222;"><strong>Find the correct category - </strong></span>
                    <span style="color: #222222;">These icons help users search information better. Select the icon that is most similar to the feature you are describing.&nbsp;</span>
                </li>
                <li style="list-style-type: lower-alpha;">
                    <span style="color: #222222;"><strong>Adding pictures and information</strong></span>
                    <span style="color: #222222;">
                        - Add a photo, title, and description of the feature. The more information the better! Let us know whether you think the condition of the feature is getting better, staying the same, or getting worse, and how the feature
                        makes you feel.
                    </span>
                </li>
                <li style="list-style-type: lower-alpha;">
                    <span style="color: #222222;"><strong>Publish</strong></span>
                    <span style="color: #222222;">
                        - Set your privacy permissions - you can select &ldquo;test&rdquo; data if you are just testing out Lukim Gather, and select &ldquo;Only Me&rdquo; if you only want the feature to be available for yourself (i.e not
                        published for everyone on Lukim Gather). Your features will be stored on your phone until you reach network service or wifi.&nbsp;
                    </span>
                </li>
            </ol>
        </li>
        <li style="list-style-type: decimal;">
            <span style="color: #222222;"><strong>Annual Environmental Survey </strong></span>
            <span style="color: #222222;">
                - Once per year, conduct a community consultation using the &ldquo;Annual Environmental Survey&rdquo; located in the Forms to assess the shared opinion about the condition of the benefits, values, and threats in the conservation
                area. This form takes about &frac12; a day to complete in consultation with your community.&nbsp;
            </span>
        </li>
        <li style="list-style-type: decimal;">
            <span style="color: #222222;"><strong>Check out your data</strong></span><span style="color: #222222;"> -&nbsp; Using the same credentials you used for the mobile app, login to </span>
            <a href="http://www.lukimgather.org" style="text-decoration: none;">
                <span style="color: #1155cc;"><u>www.lukimgather.org</u></span>
            </a>
            <span style="color: #222222;"> to see and download your features, which can be used for better management, monitoring, and communication and advocacy.</span>
        </li>
        <li style="list-style-type: decimal;">
            <span style="color: #222222;"><strong>Improve management planning</strong></span>
            <span style="color: #222222;"> - Based on the maps and community consultations, plan your actions for improved environmental management for the year ahead.&nbsp;</span>
        </li>
    </ol>
    <p>
        <span style="color: #000000;"><strong>4. Is my data safe?&nbsp;</strong></span>
    </p>
    <p>
        <span style="color: #000000;">
            Once you are connected to the internet, the data will be uploaded to a centralized server. Lukim Gather uses cloud computing to ensure fast and secure data transfers. We believe that environmental information is for everyone, and
            highly recommend you publish data for everyone to see. However, if you are worried about your personal safety you can choose to publish the data anonymously, and if you are worried about exposing important cultural heritage (such as
            sacred sites) to conflict, then you can choose to publish data for &ldquo;Only Me&rdquo;. This means the data will only be viewable to your private user account, and cannot be shared other than through a screenshot.&nbsp;
        </span>
    </p>
    <ol start="5">
        <li style="list-style-type: decimal;">
            <span style="color: #000000;"><strong>Troubleshooting - Why isn&rsquo;t the app working?&nbsp;</strong></span>
        </li>
    </ol>
    <p><span style="color: #000000;">There are a variety of reasons why Lukim Gather might not be working well on your phone. Firstly make sure you are using the latest version of the app:&nbsp;</span></p>
    <ul>
        <li style="list-style-type: disc;">
            <span style="color: #000000;">If it is running slowly or crashing:</span>
            <ul>
                <li style="list-style-type: circle;"><span style="color: #000000;">check if you have other apps running in the background and close them.&nbsp;</span></li>
                <li style="list-style-type: circle;"><span style="color: #000000;">check that you have ample storage space on your phone.</span></li>
            </ul>
        </li>
        <li style="list-style-type: disc;">
            <span style="color: #000000;">If the basemap is not loading</span>\r\n\t
            <ul>
                <li style="list-style-type: circle;">
                    <span style="color: #000000;">
                        Check your internet connection or wait until you are in an area with network service. If you&rsquo;ve previously opened the app with internet connection, even if you move to area with no network or lose internet
                        connection, the basemap will still load. You can still record your geolocation without the basemap rendered.&nbsp;
                    </span>
                </li>
            </ul>
        </li>
    </ul>
    <p>
        <span style="color: #000000;">Finally, if none of the above solutions are working, try uninstalling and reinstalling the app. For more support contact us through the &ldquo;Feedback&rdquo; form under the Lukim Gather menu.&nbsp;</span>
    </p>
`;

const Help = () => {
    return (
        <View style={styles.container}>
            <WebViewer html={helpData} />
        </View>
    );
};

export default Help;
