
import {Alert} from 'react-native';
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';

import {
    captureException,
    captureJSException,
    initializeSentry,
} from './sentry';

const isDev = __DEV__
const allowInDevMode = true
class JavascriptAndNativeErrorHandler {
    initializeErrorHandling = () => {
        initializeSentry();
        
        setJSExceptionHandler(this.errorHandler, allowInDevMode);
        setNativeExceptionHandler(this.nativeErrorHandler, false);
    };

    nativeErrorHandler = (e: string) => {
        console.warn('Handling native error ' + e);
        captureException(e);
    };

    errorHandler = (e: unknown, isFatal: boolean) => {
        
        if (isDev && !e && !isFatal) {
            // react-native-exception-handler redirects console.error to call this, and React calls
            // console.error without an exception when prop type validation fails, so this ends up
            // being called with no arguments when the error handler is enabled in dev mode.
            return;
        }

        console.warn('Handling Javascript error', e, isFatal);

        if ( isFatal) {
            captureJSException(e, isFatal);
        }

        if (isFatal && e instanceof Error) {
            Alert.alert(
                'Lỗi',
                'Có lỗi bất thường xảy ra' + `\n\n${e.message}\n\n${e.stack}`
            );
        }
    };
}

export default new JavascriptAndNativeErrorHandler();
