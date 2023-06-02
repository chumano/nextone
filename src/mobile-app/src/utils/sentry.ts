// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import AuthServiceInstance from '../services/AuthService';
import qs from 'qs';
import { UserTokenInfoResponse } from '../types/Auth/Auth.type';
import { JWTDecodeInfo } from '../types/Auth/JWTDecodeInfo.type';
import jwtDecode from 'jwt-decode';

export const BREADCRUMB_UNCAUGHT_APP_ERROR = 'uncaught-app-error';
export const BREADCRUMB_UNCAUGHT_NON_ERROR = 'uncaught-non-error';

const Config = {
    SentryEnabled : true,
    SentryDsnIos: "", //
    SentryDsnAndroid: "",
    SentryOptions: {
        deactivateStacktraceMerging: true,
        autoBreadcrumbs: {
            xhr: false,
            console: true
        },
        severityLevelFilter: ["fatal"]
    },
}
const isBetaApp= true;
let Sentry: any;

export function initializeSentry() {
    if (!Config.SentryEnabled) {
        return;
    }

    if (!Sentry) {
        Sentry = require('@sentry/react-native');
    }

    const dsn = getDsn();

    if (!dsn) {
        console.warn('Sentry is enabled, but not configured on this platform');
        return;
    }

    const mmConfig = {
        environment:  'production',
        tracesSampleRate:  1.0,
        sampleRate:  1.0,
        attachStacktrace: true, // For Beta, stack traces are automatically attached to all messages logged
    };

    const eventFilter = Array.isArray(Config.SentryOptions?.severityLevelFilter) ? Config.SentryOptions.severityLevelFilter : [];
    const sentryOptions = {...Config.SentryOptions};
    Reflect.deleteProperty(sentryOptions, 'severityLevelFilter');

    Sentry.init({
        dsn,
        sendDefaultPii: false,
        ...mmConfig,
        ...sentryOptions,
        enableCaptureFailedRequests: false,
        integrations: [
            new Sentry.ReactNativeTracing({

                // Pass instrumentation to be used as `routingInstrumentation`
                routingInstrumentation: new Sentry.ReactNativeNavigationInstrumentation(
                    Navigation,
                    {enableTabsInstrumentation: false},
                ),
            }),
        ],
        beforeSend: (event: Event | any) => {
            if (isBetaApp || (event?.level && eventFilter.includes(event.level))) {
                return event;
            }

            return null;
        },
    });
}

function getDsn() {
    if (Platform.OS === 'android') {
        return Config.SentryDsnAndroid;
    } else if (Platform.OS === 'ios') {
        return Config.SentryDsnIos;
    }

    return '';
}

export function captureException(error: unknown) {
    if (!Config.SentryEnabled) {
        return;
    }

    if (!error) {
        console.warn('captureException called with missing arguments', error);
        return;
    }
    Sentry.captureException(error);
}

export function captureJSException(error: unknown, isFatal: boolean) {
    if (!Config.SentryEnabled) {
        return;
    }

    if (!error) {
        console.warn('captureJSException called with missing arguments', error);
        return;
    }

    captureException(error);
}


const getUserContext = async () => {

    const access_token = await AuthServiceInstance.getAccessToken();
    if (access_token) {
        const jwtDecodeInfo = jwtDecode(
            access_token,
        ) as JWTDecodeInfo;
        return jwtDecodeInfo
    }
    return  undefined;
};



export const addSentryContext = async () => {
    if (!Config.SentryEnabled || !Sentry) {
        return;
    }

    try {
        const userContext = await getUserContext();
        Sentry.setContext('User-Information', userContext);

    } catch (e) {
        console.error(`addSentryContext `, e);
    }
};
