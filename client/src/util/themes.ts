export type Colors = { theme: string, accent: string, shadow: string };
export type ColorTheme = { dark: Colors, light: Colors }

export const defaultTheme: ColorTheme = {
    dark: {
        theme: "#ff594c",
        accent: "#eb144c",
        shadow: "#b91c1c"
    },
    light: {
        theme: "#a51618",
        accent: "#b91c1c",
        shadow: "#b91c1c"
    }
}

export const goldenRod: ColorTheme = {
    dark: {
        theme: '#f59e0b',
        accent: '#ea580c',
        shadow: '#c2410c'
    },
    light: {
        theme: '#f59e0b',
        accent: '#ea580c',
        shadow: '#c2410c'
    }
}
