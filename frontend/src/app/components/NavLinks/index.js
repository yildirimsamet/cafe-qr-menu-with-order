
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { useAuth } from '@/app/hooks/useAuth';
import { useWindowSize } from '@/app/hooks/useWindowSize';
import styles from './styles.module.scss';

const NavLinks = ({ className }) => {
    const { user } = useAuth();
    const pathname = usePathname();
    const { isMobile } = useWindowSize();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            { path: '/statistics', title: 'İstatistikler' },
            { path: '/settings', title: 'Ayarlar' },
        ],
    };

    return (
        (isMobile ? (
            <div className={styles.navLinksMobile}>
                {isMobileMenuOpen ?
                    <IoMdClose onClick={() => setIsMobileMenuOpen(false)} /> :
                    <HiOutlineMenu onClick={() => setIsMobileMenuOpen(true)} />}
                <div
                    className={cn(
                        styles.navLinksMobileMenuWrapper,
                        { [styles.navLinksMobileMenuWrapper_open]: isMobileMenuOpen },
                    )}
                >
                    {routesForUsersRole[user.role].map((route, index) => {
                            return (
                                <Link
                                    key={index}
                                    className={cn(
                                        styles.navLinksMobileMenuWrapperLink,
                                        { [styles.navLinksMobileMenuWrapperLink_active]: pathname === route.path },
                                    )}
                                    href={route.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >{route.title}
                                </Link>
                            );
                        })}
                </div>
            </div>
        ) : (<div className={cn(styles.navLinks, className)}>
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
        </div>))
    );
};

export default NavLinks;
