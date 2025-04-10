import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import cn from 'classnames';
import * as React from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import NavLinks from '../NavLinks';
import styles from './style.module.scss';

const NavBar = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    if (user && window?.location?.pathname !== '/') {
        return (
            <div className={styles.wrapper}>
                <div className={cn(styles.wrapperInner, 'container')}>
                    <NavLinks className={styles.wrapperLeft} />
                    <div className={styles.wrapperRight}>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            className={styles.wrapperRightButton}
                        >
                            {user.username}
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default NavBar;
