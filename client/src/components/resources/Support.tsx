import {ReactNode} from 'react';


export default function Support() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-5 pr-6">
                Student resources
            </h1>

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
        </>
    );
}

type SupportCardProps = {name: string, tel: string, children: ReactNode, sms?: boolean}
function SupportCard(props: SupportCardProps) {
    const {name, tel, children, sms} = props;

    return (
        <div className="px-5 py-3 bg-gray-100 dark:bg-content-secondary rounded">
            <h2 className="font-semibold mb-0.5">{name}</h2>
            <h3><a href={`${sms ? 'sms' : 'tel'}:${tel}`}>{tel}</a></h3>
            <p className="secondary">{children}</p>
        </div>
    )
}
