import React from 'react';
import { StyleSheet } from 'react-native';

var containerView = {
    margin: 20,
    flex: 1,
    flexDirection: "column",
}


export const authStyles = StyleSheet.create({

    containerView: {
        ...containerView,
        justifyContent: "center",
    },

    textLogo: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
    },
})

export const mainStyles = StyleSheet.create({
    
    containerView: {
        ...containerView,
        justifyContent: "flex-start",
    },

    tabImage: {
        width: 30,
        height: 30,
    },

    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "black",
    },
})

export const fitnessStyles = StyleSheet.create({

    dimView: {
        margin: 0,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#00000080"
    },

    modalView: {
        backgroundColor: "white",
        padding: 35,
        elevation: 10,
    },

    containerView: {
        ...containerView,
        justifyContent: "flex-start",
    },

    buttonView: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },

    featureView: {
        marginBottom: 20,
        padding: 20,

        elevation: 10,

        backgroundColor: "#ffffff"
    },

    featureText: {
        color: "black", 
        fontWeight: "bold",
        fontSize: 20,
    },
})