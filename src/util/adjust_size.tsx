import { Dimensions } from 'react-native';

const maxWidthScreen = Dimensions.get('screen').width;
const maxHeigthScreen = Dimensions.get('screen').height;
/** Dimensions Screen - Tablet e Telemovel */
let widthDividerDefault = 1.2;
let heigthDividerDefault = 3.5;
let isTablet = false;
if (maxWidthScreen > 500) {
  widthDividerDefault = 1.16;
  heigthDividerDefault = 6;
  isTablet = true;
}
const maxWidthScreenCenter = maxWidthScreen / widthDividerDefault;
const maxHeigthScreenCenter = maxHeigthScreen / heigthDividerDefault;

const getDimensionsConfigFromPercentage = (percent: any) => {
  let multiplicatorWidth = 0.7;
  let multiplicatorHeight = 3.8;
  let divider = 0.8;
  let subtractDivider = -0.3;

  if (maxWidthScreen >= 500) {
    multiplicatorWidth = 1.3;
    multiplicatorHeight = 1.2;
    divider = 0.8;
    subtractDivider = 0.35;
  }

  const width = (maxWidthScreenCenter * percent) / 100 / divider;
  const height = (maxHeigthScreenCenter * percent) / 100 / (divider - subtractDivider);

  return {
    width,
    height,
  };
};

const dimensions = {
  width: {
    full: maxWidthScreen,
    center: maxWidthScreenCenter,
  },
  height: {
    full: maxHeigthScreen,
    center: maxHeigthScreenCenter,
  },
  getConfigDimensions: getDimensionsConfigFromPercentage,
  isTablet,
};

export default dimensions;
