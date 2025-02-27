
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import styles from './styles.module.scss';

const NavLinks = ({ className }) => {
    const { user } = useAuth();
    const pathname = usePathname();
    const routesForUsersRole = {
        'waiter': [{ path: '/tables', title: 'Masalar' }, { path: '/orders', title: 'Siparişler' }],
        'admin': [
            { path: '/tables', title: 'Masalar' },
            { path: '/orders', title: 'Siparişler' },
            { path: '/users', title: 'Kullanıcılar' },
            { path: '/edit', title: 'Düzenle' },
        ],
        'superadmin': [
            { path: '/tables', title: 'Masalar' },
            { path: '/orders', title: 'Siparişler' },
            { path: '/users', title: 'Kullanıcılar' },
            { path: '/edit', title: 'Düzenle' },
        ],
    };

    return (
        <div className={cn(styles.navLinks, className)}>
            {routesForUsersRole[user.role].map((route, index) => {
                return (
                    <Link
                        key={index}
                        className={cn(styles.navLinksLink, { [styles.navLinksLink_active]: pathname === route.path })}
                        href={route.path}
                    >{route.title}
                    </Link>
                );
            })}
        </div>
    );
};

export default NavLinks;
