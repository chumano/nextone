import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';

import { eventApi } from '../../apis/event.api';
import { APP_THEME } from '../../constants/app.theme';
import { EventStackProps } from '../../navigation/EventStack';
import { EventType } from '../../types/Event/EventType.type';

const EventTypePickScreen = () => {
    const navigation = useNavigation<EventStackProps>();
    const [eventTypes, setEventTypes] = useState<EventType[]>([])
    const [eventCodeType, setEventCodeType] = useState<string>();

    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await  eventApi.getEventTypesForMe();
            if(!response.isSuccess){
                return;
            }
            const eventTypes = response.data;
            setEventTypes(eventTypes)
            if(eventTypes.length>0){
                setEventCodeType(eventTypes[0].code)
            }
        }

        fetchData();
    },[setEventCodeType])

    const onNext = useCallback(() => {
        const eventType = eventTypes.find(o=>o.code === eventCodeType);
        navigation.navigate('SendEventScreen', {
            eventType: eventType
        });
    }, [navigation,eventCodeType, eventTypes]);

    return (
        <View>
            <View style={styles.eventTypeContainer}>
                <View style={[styles.labelContainer, { marginBottom: 8 }]}>
                    <Text style={styles.labelText}>Loại sự kiện</Text>
                </View>
                <View style={styles.radioButtonGroupContainer}>
                    {eventTypes.length > 0 && 
                        <RadioButton.Group
                            value={eventCodeType!}
                            onValueChange={value => setEventCodeType(value)}>
                            {eventTypes.map(type => (
                                <RadioButton.Item
                                    key={type.code}
                                    label={type.name}
                                    value={type.code}
                                    style={[styles.radioItem, { marginLeft: 16 }]}
                                    labelStyle={{ marginLeft: -16 }}
                                />
                            ))}
                        </RadioButton.Group>
                    }
                    {eventTypes.length ===0 &&
                        <Text>Chưa có loại sự kiện</Text>
                    }
                    
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button disabled={!eventCodeType}
                    mode="contained"
                    onPress={onNext}>
                    Tiếp tục
                </Button>
            </View>
        </View>
    )
}

export default EventTypePickScreen


const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 100,
        paddingHorizontal: 16,
    },
    eventTypeContainer: {
        marginVertical: 24,
    },
    labelText: {
        color: 'black'
    },

    radioButtonGroupContainer: {
        backgroundColor: APP_THEME.colors.background,
    },
    radioItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#cecece',
    },

    buttonContainer: {
        marginTop: 40,
    },
});