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
    }
})