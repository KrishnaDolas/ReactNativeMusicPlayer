import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const TabTwoScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TabTwoScreen</Text>
      <Image
        source={reactlogo}
        style={{width: 140, height: 140}}
        />
    </View>
  )
}

export default TabTwoScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center"
}
})