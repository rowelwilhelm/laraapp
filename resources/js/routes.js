import dashboard from './components/dashboard';
import profile from './components/profile';
import users from './components/users';
import developer from './components/developer'

export default [
    {path: '/dashboard',component: dashboard},
    {path: '/profile',component: profile},
    {path: '/users',component: users},
    {path: '/developer',component: developer},
];
