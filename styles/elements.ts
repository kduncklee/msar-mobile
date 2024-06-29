import { StyleSheet } from 'react-native';
import colors from '@styles/colors';

export const elements = StyleSheet.create({
  tray: {
    backgroundColor: colors.secondaryBg,
    borderRadius: 8,
  },
  capsule: {
    flexDirection: 'row',
    backgroundColor: colors.grayText,
    borderRadius: 100,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignContent: 'center',
    justifyContent: 'center',
  },
  smallYellowText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.secondaryYellow,
  },
  capsuleButton: {
    flexDirection: 'row',
    backgroundColor: colors.yellow,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteButtonText: {
    fontWeight: '500',
    color: colors.black,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 4,
    borderColor: colors.grayText,
    borderWidth: 1,
    borderRadius: 8,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondaryYellow,
    marginBottom: 6,
  },
  fieldPlaceholder: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.grayText,
  },
  fieldText: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.primaryText,
  },
  smallText: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.primaryText,
  },
  mediumText: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.primaryText,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.black,
  },
  fieldImage: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },
  fieldCheckImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  buttonIcon: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  informationDiv: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderBottomColor: colors.primaryBg,
    borderBottomWidth: 0.75,
  },
  standardDiv: {
    marginVertical: 4,
    marginHorizontal: 20,
    borderBottomColor: colors.primaryBg,
    borderBottomWidth: 0.75,
  },
  messageSelfTray: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
  },
  tabBadge: {
    marginLeft: 8,
    paddingHorizontal: 4,
    height: 18,
    width: 'auto',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

});
