import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

interface IProps {
  eventImageUrl: string;
}

const EventFileItem: React.FC<IProps> = ({eventImageUrl}) => {
  return (
    <View style={styles.eventImageContainer}>
      <Image style={styles.eventImage} source={{uri: eventImageUrl}} />
    </View>
  );
};

export default EventFileItem;

const styles = StyleSheet.create({
  eventImageContainer: {
    width: 164,
    height: 164
  },
  eventImage: {
    width: '100%',
    height: '100%'
  }
});
