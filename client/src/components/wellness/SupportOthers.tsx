import { ReactNode } from 'react';

export default function SupportOthers() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Support Others</h2>
            <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">
                    <h3 className="font-medium text-red-800 dark:text-red-200">Emergency Services</h3>
                    <p className="text-red-700 dark:text-red-300 font-bold text-lg">911</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Request a crisis intervention team</p>
                </div>
            </div>
            <p>If you are concerned for a friend, classmate, or another student and would like Wellness to check in with them, please email <a href="mailto:gunnwellnessteam@pausd.org" className="break-all">gunnwellnessteam@pausd.org</a> with:</p>
            <div className="indent-8">
                <ul className="list-disc list-inside">
                    <li>Their full name</li>
                    <li>Their grade</li>
                    <li>What prompted your concerns (<a href="https://www.nimh.nih.gov/health/publications/warning-signs-of-suicide" target="_blank" rel="noopener noreferrer" className="break-all">see a list of concerns here</a>)</li>
                    <li>Any additional information you think would be helpful</li>
                    <li>If you'd like to remain anonymous, please include that too. </li>
                </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">
                <p className="text-red-600 dark:text-red-400">This email is not for emergencies; in case of an emergency call 911 or use other emergency resources.</p>

            </div>
        </div>
    );
}