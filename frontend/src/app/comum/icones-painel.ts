/**
 * Providers dos ícones Lucide usados no painel.
 */

import { provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideCircleAlert,
  lucideHome,
  lucideKeyRound,
  lucideLayoutDashboard,
  lucideLogIn,
  lucideLogOut,
  lucidePencil,
  lucideSearch,
  lucideShield,
  lucideTrash2,
  lucideUserPlus,
  lucideUserRound,
  lucideUsers,
} from '@ng-icons/lucide';

export const iconesPainelProvider = provideIcons({
  lucideSearch,
  lucideUserPlus,
  lucideKeyRound,
  lucideLogOut,
  lucideLogIn,
  lucidePencil,
  lucideTrash2,
  lucideUsers,
  lucideUserRound,
  lucideLayoutDashboard,
  lucideBookOpen,
  lucideHome,
  lucideShield,
  lucideCircleAlert,
});
