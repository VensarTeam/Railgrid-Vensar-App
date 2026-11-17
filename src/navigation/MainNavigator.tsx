import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Activity, ClipboardList, LayoutDashboard, UserRound } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import type { MainTabParamList } from './navigationTypes';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { AssetsScreen } from '../screens/assets/AssetsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
const Tab = createBottomTabNavigator<MainTabParamList>();
type TabIconProps = { color: string; size: number };
const DashboardIcon = ({ color, size }: TabIconProps) => (
  <LayoutDashboard color={color} size={size} />
);
const ProjectsIcon = ({ color, size }: TabIconProps) => <ClipboardList color={color} size={size} />;
const AssetsIcon = ({ color, size }: TabIconProps) => <Activity color={color} size={size} />;
const ProfileIcon = ({ color, size }: TabIconProps) => <UserRound color={color} size={size} />;
export function MainNavigator() {
  const t = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.secondary,
        tabBarInactiveTintColor: t.colors.secondaryText,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          height: t.componentHeights.tabBar,
          paddingTop: t.spacing.sm,
          paddingBottom: t.spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: t.typography.variants.caption.fontSize,
          fontFamily: t.typography.family.medium,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ tabBarIcon: ProjectsIcon }}
      />
      <Tab.Screen name="Assets" component={AssetsScreen} options={{ tabBarIcon: AssetsIcon }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ProfileIcon }} />
    </Tab.Navigator>
  );
}
