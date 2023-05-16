import React from 'react';
import {CommonActions} from '@react-navigation/native';

export const navigationRef: React.Ref<any> = React.createRef();

export function navigate(name: string, params: any) {
    (navigationRef as any)?.current?.navigate(name, params);
}

export function resetNavigation() {
    (navigationRef as any)?.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: 'Feed',
                    params: {
                        screen: 'Home',
                        params: {
                            screen: 'HomeScreen',
                        },
                    },
                },
            ],
        }),
    );
}
