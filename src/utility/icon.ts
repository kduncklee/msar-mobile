import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
