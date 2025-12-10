import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedRef
} from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

import { ThemedView } from '@/components/ui/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';


type Props = PropsWithChildren<{
  paddingTop?: number;
}>;

export default function ParallaxScrollView({
  children,
  paddingTop = RFValue(48),
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <ThemedView style={[styles.content, { paddingTop: RFValue(paddingTop) }]}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: RFValue(20),
    paddingTop: RFValue(36),
    gap: RFValue(16),
    overflow: 'hidden',
  },
});
