import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
 
  {
    displayName: 'Registrados',
    iconName: 'user',
    route: 'painel/registrados',
  },
 
  {
    displayName: 'Blog',
    iconName: 'chart-donut-3',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Post',
        iconName: 'point',
        route: 'apps/blog/post',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        route: 'apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
      },
    ],
  },
 
 
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Login',
        iconName: 'point',
        route: '/authentication/side-login',
      },
      {
        displayName: 'Boxed Login',
        iconName: 'point',
        route: '/authentication/boxed-login',
      },
    ],
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Login',
        iconName: 'point',
        route: '/authentication/side-register',
      },
      {
        displayName: 'Boxed Login',
        iconName: 'point',
        route: '/authentication/boxed-register',
      },
    ],
  },
  {
    displayName: 'Forgot Password',
    iconName: 'rotate',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Forgot Password',
        iconName: 'point',
        route: '/authentication/side-forgot-pwd',
      },
      {
        displayName: 'Boxed Forgot Password',
        iconName: 'point',
        route: '/authentication/boxed-forgot-pwd',
      },
    ],
  },
  {
    displayName: 'Two Steps',
    iconName: 'zoom-code',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Two Steps',
        iconName: 'point',
        route: '/authentication/side-two-steps',
      },
      {
        displayName: 'Boxed Two Steps',
        iconName: 'point',
        route: '/authentication/boxed-two-steps',
      },
    ],
  },
  {
    displayName: 'Error',
    iconName: 'alert-circle',
    route: '/authentication/error',
  },
  {
    displayName: 'Maintenance',
    iconName: 'settings',
    route: '/autenticacao/maintenance',
  },
  
 
];
