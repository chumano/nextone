
import { useRoute } from '@react-navigation/native';
import React, { Fragment, useState } from 'react';
import BottomTabNavigator from './navigation/BottomTabNavigator';


const RootApp = () => {

    return <Fragment>
        <BottomTabNavigator />
    </Fragment>

}

export default RootApp