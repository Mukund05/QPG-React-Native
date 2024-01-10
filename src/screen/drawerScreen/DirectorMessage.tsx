import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../utils/Header';

const DirectorMessage: React.FC<{navigation:any}> = ({navigation}) => {
  return (
    <>
    <Header
      title="Director Message"
      bgColor="blue"
      leftIcon='menu'
      onPressLeftIcon={() => navigation.openDrawer()}
    />
    <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.header}>Director Message</Text>
        <Text style={styles.content}>
          This is a demo project for the purpose of learning React Native. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Modi placeat qui
          aut natus necessitatibus reiciendis officiis id, voluptatem cum enim
          aliquid dolores eius temporibus commodi architecto accusantium.
          Veritatis, numquam. Deleniti! Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Odit quo explicabo fugiat, quos natus omnis
          laboriosam nemo magnam sequi inventore iure, similique asperiores
          minus debitis odio aliquam soluta eos a illo quibusdam cum. Rerum,
          molestias accusamus dolorem illum modi officia, inventore quas tenetur
          impedit distinctio fugit veritatis. Quis commodi a cumque sit odio,
          ullam necessitatibus officia voluptate vitae quas consequatur suscipit
          sequi earum veritatis distinctio expedita sapiente! Blanditiis commodi
          consectetur fuga suscipit eveniet obcaecati molestiae. 
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
    margin: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#2483ff',
  },
  content: {
    fontSize: 16,
    margin: 20,
    color: 'black',
    textAlign: 'justify',
    lineHeight: 25,
  },
  footer: {
    fontSize: 20,
    color: "purple",
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  }
});
