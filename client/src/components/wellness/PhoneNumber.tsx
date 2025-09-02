export default function Phone1() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Crisis & Emergency</h2>
            <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">
                    <h3 className="font-medium text-red-800 dark:text-red-200">Emergency Services</h3>
                    <p className="text-red-700 dark:text-red-300 font-bold text-lg">911</p>
                    <p className="text-sm text-red-600 dark:text-red-400">For immediate medical, fire, or police emergencies</p>
                </div>
                <div>
                    <h3 className="font-medium">Lorem ipsum dolor sit amet</h3>
                    <p className="font-bold text-lg">xxx-xxx-xxxx</p>
                    <p className="text-sm text-secondary">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
        </div>
    );
}