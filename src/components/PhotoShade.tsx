import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export function PhotoShade({ id, topOpacity = 0.18, bottomOpacity = 0.88 }: { id: string; topOpacity?: number; bottomOpacity?: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={(event) => {
      const { width, height } = event.nativeEvent.layout;
      setSize((current) => current.width === width && current.height === height ? current : { width, height });
    }}>
      {size.width > 0 && size.height > 0 ? <Svg width={size.width} height={size.height}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#071B2D" stopOpacity={topOpacity} />
            <Stop offset="0.45" stopColor="#071B2D" stopOpacity={(topOpacity + bottomOpacity) / 2} />
            <Stop offset="1" stopColor="#071B2D" stopOpacity={bottomOpacity} />
          </LinearGradient>
        </Defs>
        <Rect width={size.width} height={size.height} fill={`url(#${id})`} />
      </Svg> : null}
    </View>
  );
}
