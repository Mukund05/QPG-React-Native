import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';
import {responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth} from 'react-native-responsive-dimensions';

const DirectorMessage: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <>
      <Header
        title="Director Message"
        bgColor="blue"
        leftIcon="menu"
        onPressLeftIcon={() => navigation.openDrawer()}
      />
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Director Message</Text>
          <Text style={styles.content}>
            I am pleased to address you in this message as we reflect on the
            accomplishments and milestones achieved by Best Way Learning over
            the past year. It is with great pride and gratitude that I share
            with you the highlights of our journey and the exciting path that
            lies ahead. In the face of challenges, our dedicated team has
            demonstrated resilience, innovation, and unwavering commitment to
            excellence. Together, we have achieved remarkable growth and have
            positioned Best Way Learning as a leader in Ed. Tech.
            This success is a testament to the collective efforts of each team
            member and the trust and support of our valued stakeholders. As we
            embark on the next chapter, let us remain united in our pursuit of
            excellence. Together, we can overcome challenges, embrace
            opportunities, and build a future that is even brighter than our
            past. 
            Thank you for your continued support and commitment.
          </Text>
          <Text style={styles.footer}>Best Regards</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default DirectorMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
    margin: responsiveScreenHeight(2),
    borderRadius: 10,
  },
  header: {
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
    textAlign: 'center',
    margin: responsiveScreenHeight(2),
    color: '#2483ff',
  },
  content: {
    fontSize: responsiveFontSize(2),
    letterSpacing: 1,
    margin: responsiveScreenHeight(2.2),
    color: 'black',
    textAlign: 'justify',
    lineHeight: 22,
    fontWeight: '200'
  },
  footer: {
    fontSize: responsiveFontSize(2.5),
    color: 'purple',
    alignSelf: 'flex-start',
    marginLeft: responsiveScreenWidth(5),
    marginBottom: responsiveScreenHeight(2),
    fontWeight: 'bold',
  },
});
