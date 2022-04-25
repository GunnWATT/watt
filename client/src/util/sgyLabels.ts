import {UserData} from "../contexts/UserDataContext";
import {darkPerColors, periodColors} from "../components/schedule/Periods";


export const defaultLabels = ['Assignment', 'Document', 'Event', 'Note', 'Test', 'Page'];
const darkLabelColors = ["#fc6471", "#a882dd", "#70ae6e", "#beee62", "#f4743b", "#70A9A1", "#373739"];

export function parseLabelColor(label: string, userData: UserData) {
    if (!userData.sgy) throw 'User not authenticated in schoology!';
    const custom = userData.sgy!.custom.labels.find(({id}) => id === label);
    if (custom) return custom.color;

    const defaultIndex = defaultLabels.indexOf(label);
    if (defaultIndex >= 0) {
        if(userData.options.theme === 'dark') return darkLabelColors[ defaultIndex ];
        else return periodColors[ defaultIndex ];
    }

    console.error(`Label "${label}" not found.`);
    if (userData.options.theme === 'dark') return darkLabelColors[darkLabelColors.length - 1]
    return periodColors[periodColors.length - 1];
}

export function parseLabelName(label:string, userData: UserData) {
    if (!userData.sgy) throw 'User not authenticated in schoology!';
    const custom = userData.sgy!.custom.labels.find(({ id }) => id === label);
    if(custom) return custom.name;
    else return label;
}

export const allLabels = (userData: UserData) => {
    return [...defaultLabels, ...userData.sgy.custom.labels.map(label => label.id)];
}

export function parsePriority(priority: number, userData: UserData) {
    if (priority === -1) {
        // no priority
        if (userData.options.theme === 'dark') return darkPerColors[darkPerColors.length - 1]
        return periodColors[periodColors.length - 1];
    }

    // TODO: colors
    if (userData.options.theme === 'dark') return darkPerColors[priority];
    else return periodColors[priority];
}
