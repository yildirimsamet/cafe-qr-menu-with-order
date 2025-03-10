import { Dialog } from '@mui/material';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import styles from './styles.module.scss';

const Color = ({ name, value, isValidHexColor, setChangedColors }) => {
    const [isColorEditModalOpened, setIsColorEditModalOpened] = useState(false);
    const [isValidHex, setIsValidHex] = useState(isValidHexColor(value));
    const [color, setColor] = useState(value);

    useEffect(() => {
        setIsValidHex(isValidHexColor(color));
        setChangedColors((prev) => ({ ...prev, [name]: color }));
    }, [color]);

    const convertName = (name) => {
        if (name.includes('text-')) {
            if (name.includes('darker')) {
                return `En Koyu Yazı Rengi ${name.split('-')[1]}`;
            } else if (name.includes('dark')) {
                return `Koyu Yazı Rengi ${name.split('-')[1]}`;
            }
            return `Yazı Rengi ${name.split('-').slice(-1)[0]}`;
        } else if (name.includes('bg-')) {
            if (name.includes('darker')) {
                return `En Koyu Arka Plan Rengi ${name.split('-')[1]}`;
            } else if (name.includes('dark')) {
                return `Koyu Arka Plan Rengi ${name.split('-')[1]}`;
            }
            return `Arka Plan Rengi ${name.split('-').slice(-1)[0]}`;
        } else if (name.includes('border-')) {
            return `Kenar Rengi ${name.split('-').slice(-1)[0]}`;
        } else if (name.includes('scroll')) {
            return `Scroll Bar Rengi ${name.split('-').slice(-1)[0]}`;
        } else if (name.includes('accent-')) {
            return `Vurgu Rengi ${name.split('-').slice(-1)[0]}`;
        } else if (name.includes('success')) {
            return 'Başarılı Rengi';
        } else if (name.includes('danger')) {
            return 'Hata Rengi';
        } else if (name.includes('warning')) {
            return 'Uyarı Rengi';
        }

        return name;
    };

    let handleChangeTimeOut;

    const handleChange = (value) => {
        clearTimeout(handleChangeTimeOut);

        handleChangeTimeOut = setTimeout(() => {
            setColor(value);
        }, 0);
    };

    return (
        <div
            onClick={() => {
            if (!isColorEditModalOpened) {
                setIsColorEditModalOpened(true);
            }
        }}
            className={styles.wrapper}
        >
            <div className={styles.wrapperOverlay}></div>
            <div className={styles.wrapperColorPickerWrapper}>
                {isColorEditModalOpened &&
                    <div>
                        <HexAlphaColorPicker
                            className={styles.wrapperColorPickerWrapperColorPicker}
                            color={color}
                            onChange={handleChange}
                        />
                        <input
                            type='text'
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                            }}
                        />

                    </div>
                }
            </div>
            <div
                className={cn(styles.wrapperContent, {
                    [styles.wrapperContentError]: !isValidHex,
                    [styles.wrapperContentZIndex]: isColorEditModalOpened,
                })}
            >
                <div>{convertName(name)}</div>
                <div
                    style={{
                        background: color,
                        width: '25px',
                        height: '25px',
                    }}
                ></div>
            </div>
            {isColorEditModalOpened && <Dialog
                slotProps={{ backdrop: { invisible: true } }}
                open={isColorEditModalOpened}
                closeAfterTransition={false}
                disableAutoFocus
                onClose={() => {
                    setIsColorEditModalOpened(false);
                }}
            >
            </Dialog>}
        </div>
    );
};

export default Color;
