import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

type Props = PropsWithChildren<{ edges?: Edge[] }>;

export function AppScreen({ children, edges = ['top'] }: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
