import {useContext} from 'react';
import UserDataContext from '../../contexts/UserDataContext';
import {hexToRgb} from '../../util/progressBarColor';


type Colors = { theme: string, accent: string, shadow: string };
export type ColorTheme = { id: 'default' | 'goldenrod' | 'electric-violet', dark: Colors, light: Colors }

export default function ThemeHandler() {
    const {colors} = useContext(UserDataContext);

    return (
        <style>
            {`:root {
                --theme: ${hexToRgb(colors.light.theme)?.join(' ')};
                --theme-secondary: ${hexToRgb(colors.light.accent)?.join(' ')};
                --theme-tertiary: ${hexToRgb(colors.light.shadow)?.join(' ')};
            }
            :root.dark {
                --theme: ${hexToRgb(colors.dark.theme)?.join(' ')};
                --theme-secondary: ${hexToRgb(colors.dark.accent)?.join(' ')};
                --theme-tertiary: ${hexToRgb(colors.dark.shadow)?.join(' ')};
            }`}
        </style>
    )
}

export const defaultTheme: ColorTheme = {
    id: 'default',
    dark: {
        theme: '#ff594c',
        accent: '#eb144c',
        shadow: '#b91c1c'
    },
    light: {
        theme: '#a51618',
        accent: '#b91c1c',
        shadow: '#b91c1c'
    }
}

export const goldenrod: ColorTheme = {
    id: 'goldenrod',
    dark: {
        theme: '#f59e0b',
        accent: '#ea580c',
        shadow: '#c2410c'
    },
    light: {
        theme: '#f59e0b',
        accent: '#f97316',
        shadow: '#c2410c'
    }
}

export const electricViolet: ColorTheme = {
    id: 'electric-violet',
    dark: {
        theme: '#e879f9',
        accent: '#9024f5',
        shadow: '#6b21a8'
    },
    // TODO: play around with these and make better
    light: {
        theme: '#913399',
        accent: '#5d30a6',
        shadow: '#7e22ce'
    }
}
