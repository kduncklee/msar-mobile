import { StyleSheet } from 'react-native';
import colors from './colors';

export const elements = StyleSheet.create({
    tray: {
        backgroundColor: colors.secondaryBg,
        borderRadius: 8
    },
    capsule: {
        flexDirection: "row",
        backgroundColor: colors.grayText,
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignContent: "center",
        justifyContent: "center"
    },
    smallYellowText: {
        fontSize: 12,
        fontWeight: "400",
        color: colors.secondaryYellow,
    },
    capsuleButton: {
        flexDirection: "row",
        backgroundColor: colors.yellow,
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    whiteButtonText: {
        fontWeight: "500",
        color: colors.black,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 4,
        borderColor: colors.grayText,
        borderWidth: 1,
        borderRadius: 8
    },
    fieldTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.secondaryYellow,
        marginBottom: 6
    },
    fieldPlaceholder: {
        fontSize: 14,
        fontWeight: "300",
        color: colors.grayText,
    },
    fieldText: {
        fontSize: 14,
        fontWeight: "300",
        color: colors.primaryText,
    },
    mediumText: {
        fontSize: 20,
        fontWeight: "400",
        color: colors.primaryText
    },
    fieldImage: {
        resizeMode: "contain",
        width: 40,
        height: 40
    },
    fieldCheckImage: {
        resizeMode: "contain",
        width: 20,
        height: 20
    },
    informationDiv: {
        marginVertical: 8,
        marginHorizontal: 12,
        borderBottomColor: colors.primaryBg,
        borderBottomWidth: 0.75
    }
})