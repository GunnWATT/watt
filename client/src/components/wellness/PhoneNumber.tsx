import { ReactNode } from 'react';

export default function Phone1() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Crisis Support</h2>
            <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3">
                    <h3 className="font-medium text-red-800 dark:text-red-200">Emergency Services</h3>
                    <p className="text-red-700 dark:text-red-300 font-bold text-lg">911</p>
                    <p className="text-sm text-red-600 dark:text-red-400">For immediate medical, fire, or police emergencies</p>
                </div>
                <section className="grid grid-cols-[repeat(auto-fill,_minmax(16rem,_1fr))] gap-2">
                    <SupportCard name="Crisis Text Line" tel="741-741" sms>
                        For everyone in crisis; text "Help", Text "LGBTQ" for LGBTQQ-specific support.
                    </SupportCard>
                    <SupportCard name="Suicide Prevention Hotline" tel="800-273-8256">
                        Prevention and crisis resources (national)
                    </SupportCard>
                    <SupportCard name="Suicide & Crisis Line" tel="855-278-4204">
                        For individuals in crisis (Santa Clara County)
                    </SupportCard>
                    <SupportCard name="Star Vista" tel="650-579-0350">
                        Crisis intervention (San Mateo County)
                    </SupportCard>
                    <SupportCard name="Uplift" tel="408-379-9085">
                        Mobile crisis intervention and safety planning
                    </SupportCard>
                    <SupportCard name="Trevor Lifeline" tel="866-488-7386">
                        LGBTQ crisis intervention and suicide prevention
                    </SupportCard>
                </section>
            </div>
        </div>
    );
}

type SupportCardProps = { name: string, tel: string, children: ReactNode, sms?: boolean }
function SupportCard(props: SupportCardProps) {
    const { name, tel, children, sms } = props;

    return (
        <div className="px-5 py-3 bg-gray-100 dark:bg-content-secondary rounded">
            <h2 className="font-semibold mb-0.5">{name}</h2>
            <h3><a href={`${sms ? 'sms' : 'tel'}:${tel}`}>{tel}</a></h3>
            <p className="text-secondary">{children}</p>
        </div>
    )
}
